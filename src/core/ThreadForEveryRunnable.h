#ifndef THREAD_FOR_EVERY_RUNNABLE_H
#define THREAD_FOR_EVERY_RUNNABLE_H
#include "executor.h"
#include <functional>
namespace ddrive {
class ThreadForEveryRunnable : public Executor {
public:
    void execute(std::function<void(void)> runnable);
    ~ThreadForEveryRunnable();
};
} // namespace ddrive

#endif // THREAD_FOR_EVERY_RUNNABLE_H