#include "thread_pool.h"

namespace ddrive
{

    thread_pool::thread_pool(size_t num_threads) : _stop(false)
    {
        // Ensure we create at least one thread
        if (num_threads < 1)
            num_threads = 1;

        for (size_t i = 0; i < num_threads; ++i)
        {
            _workers.emplace_back(
                [this]
                {
                    while (true)
                    {
                        std::function<void(void)> _task;
                        {
                            std::unique_lock<std::mutex> lock(this->_mutex);

                            // Wait until there is a task or we are stopping
                            this->_condition.wait(
                                lock, [this]
                                { return this->_stop || !this->_tasks.empty(); });

                            // If stopping and no tasks left, exit thread
                            if (this->_stop && this->_tasks.empty())
                                return;

                            _task = std::move(this->_tasks.front());
                            this->_tasks.pop();
                        }

                        // Execute the task outside the lock
                        _task();
                    }
                });
        }
    }

    thread_pool::~thread_pool()
    {
        {
            std::unique_lock<std::mutex> lock(_mutex);
            _stop = true;
        }

        // Wake up all threads so they can check the stop flag
        _condition.notify_all();

        for (std::thread& worker : _workers)
        {
            if (worker.joinable())
                worker.join();
        }
    }

    void thread_pool::execute(std::function<void(void)> runnable)
    {
        {
            std::unique_lock<std::mutex> lock(_mutex);

            _tasks.emplace(std::move(runnable));
        }
        _condition.notify_one();
    }

} // namespace ddrive
