#ifndef DOODLE_DRIVE_THREAD_FOR_EVERY_RUNNABLE_H
#define DOODLE_DRIVE_THREAD_FOR_EVERY_RUNNABLE_H

#include "executor.h"
#include <functional>

namespace ddrive
{

    class thread_for_every_runnable : public executor
    {
    public:
        /**
         * @brief Executes a runnable task in a new thread.
         *
         * @param runnable A function representing the task to be executed.
         */
        void execute(std::function<void(void)> runnable);

        /**
         * @brief Virtual destructor for proper cleanup of derived classes.
         */
        ~thread_for_every_runnable();
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_THREAD_FOR_EVERY_RUNNABLE_H
