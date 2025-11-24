#include "cli.h"

/**
 * @brief Main entry point for the CLI application.
 * calls cli.loop to start processing commands.
 */
int main(int argc, char* argv[])
{
    CLI cli;
    cli.cli_loop();
    return 0;
}