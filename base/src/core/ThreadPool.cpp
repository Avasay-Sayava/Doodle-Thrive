#include "ThreadPool.h"

namespace ddrive
{

    ThreadPool::ThreadPool(size_t numThreads) : stop(false)
    {
        // Ensure we create at least one thread
        if (numThreads < 1)
            numThreads = 1;

        for (size_t i = 0; i < numThreads; ++i)
        {
            workers.emplace_back(
                [this]
                {
                    while (true)
                    {
                        std::function<void(void)> task;
                        {
                            std::unique_lock<std::mutex> lock(this->queueMutex);

                            // Wait until there is a task or we are stopping
                            this->condition.wait(
                                lock, [this]
                                { return this->stop || !this->tasks.empty(); });

                            // If stopping and no tasks left, exit thread
                            if (this->stop && this->tasks.empty())
                                return;

                            task = std::move(this->tasks.front());
                            this->tasks.pop();
                        }

                        // Execute the task outside the lock
                        task();
                    }
                });
        }
    }

    ThreadPool::~ThreadPool()
    {
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            stop = true;
        }

        // Wake up all threads so they can check the stop flag
        condition.notify_all();

        for (std::thread& worker : workers)
        {
            if (worker.joinable())
                worker.join();
        }
    }

    void ThreadPool::execute(std::function<void(void)> runnable)
    {
        {
            std::unique_lock<std::mutex> lock(queueMutex);

            tasks.emplace(std::move(runnable));
        }
        condition.notify_one();
    }

} // namespace ddrive
