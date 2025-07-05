/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-17 18:04:08
 * @ Modified time: 2025-07-05 09:15:32
 * @ Description:
 *
 * Feature for abstracting fetches on component mount.
 */

// All responses from the BetterInternship API server will extend this interface
export interface FetchResponse {
  success?: boolean;
  message?: string;
}
