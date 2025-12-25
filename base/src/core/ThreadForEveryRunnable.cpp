#include "executor.h"
#include "ThreadForEveryRunnable.h"
#include <thread>

void ddrive::ThreadForEveryRunnable::execute(std::function<void(void)> runnable) {
    std::thread t([runnable]{ runnable(); });
    t.detach(); // Detach the thread to allow it to run independently
}

ddrive::ThreadForEveryRunnable::~ThreadForEveryRunnable() = default;