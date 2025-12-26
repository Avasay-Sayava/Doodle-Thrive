#ifndef THREAD_POOL_H
#define THREAD_POOL_H

#include "executor.h"
#include <atomic>
#include <condition_variable>
#include <functional>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

namespace ddrive
{
    class ThreadPool : public Executor
    {
    public:
        /**
         * @brief Construct a ThreadPool with a fixed number of workers.
         * @param numThreads Number of threads to start (default: hardware
         * concurrency).
         */
        explicit ThreadPool(size_t numThreads);

        /**
         * @brief Destructor. Stops all threads and joins them.
         */
        ~ThreadPool() override;

        /**
         * @brief Enqueues a task to be executed by the thread pool.
         * @param runnable The task to execute.
         */
        void execute(std::function<void(void)> runnable) override;

    private:
        std::vector<std::thread> workers;
        std::queue<std::function<void(void)>> tasks;

        std::mutex queueMutex;
        std::condition_variable condition;
        std::atomic<bool> stop;
    };
} // namespace ddrive

#endif // THREAD_POOL_H
