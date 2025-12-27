#ifndef DOODLE_DRIVE_THREAD_POOL_H
#define DOODLE_DRIVE_THREAD_POOL_H

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

    class thread_pool : public executor
    {
    public:
        /**
         * @brief Construct a ThreadPool with a fixed number of workers.
         * @param num_threads Number of threads to start (default: hardware
         * concurrency).
         */
        explicit thread_pool(size_t num_threads);

        /**
         * @brief Destructor. Stops all threads and joins them.
         */
        ~thread_pool() override;

        /**
         * @brief Enqueues a task to be executed by the thread pool.
         * @param runnable The task to execute.
         */
        void execute(std::function<void(void)> runnable) override;

    private:
        std::vector<std::thread> _workers;
        std::queue<std::function<void(void)>> _tasks;
        std::mutex _mutex;
        std::condition_variable _condition;
        std::atomic<bool> _stop;
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_THREAD_POOL_H
