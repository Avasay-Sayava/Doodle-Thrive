#ifndef EXECUTOR_H
#define EXECUTOR_H

#include "../core/cd.h"
#include <string>
#include <functional>

namespace ddrive {
class Executor {
public:
    virtual void execute(std::function<void(void)> runnable) = 0;
    virtual ~Executor();
};

} // namespace ddrive
#endif // EXECUTOR_H