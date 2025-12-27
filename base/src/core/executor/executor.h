#ifndef DOODLE_DRIVE_EXECUTOR_H
#define DOODLE_DRIVE_EXECUTOR_H

#include <functional>

namespace ddrive
{

    class executor
    {
    public:
        /**
         * @brief Executes a runnable task.
         *
         * @param runnable A function representing the task to be executed.
         */
        virtual void execute(std::function<void(void)> runnable) = 0;

        /**
         * @brief Virtual destructor for proper cleanup of derived classes.
         */
        virtual ~executor();
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_EXECUTOR_H
