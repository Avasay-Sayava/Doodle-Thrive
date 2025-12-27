#include "thread_for_every_runnable.h"
#include "executor.h"

#include <thread>

void ddrive::thread_for_every_runnable::execute(std::function<void(void)> runnable)
{
    std::thread t([runnable] { runnable(); });
    t.detach(); // Detach the thread to allow it to run independently
}

ddrive::thread_for_every_runnable::~thread_for_every_runnable() = default;
