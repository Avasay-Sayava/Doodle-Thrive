#ifndef SEARCH_H
#define SEARCH_H

#include <string>

namespace storageMethods {
/**
 * @brief Search for files containing specific content
 * 
 * @param content The content to search
 */
std::string search(const std::string& content);

}
#endif