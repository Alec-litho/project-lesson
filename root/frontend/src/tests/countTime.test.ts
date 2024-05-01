import { countTime } from "../helper_functions/countTime"



describe('count time test', () => {
    it('countTime', () => {
      expect(countTime("Dec 30 2023 at 11:16:05"))
    })
  })
  "Jul 29 2023 at 11:16:05" && "Apr 30 2024 at 16:16:05"
  "Jul 29 2023 at 11:16:05" && "Aug 1 2023 at 11:16:05"
  /*
  1. 5 hours ago
  2. 1 day ago
  3. 9 months ago -> if it was 0 then last is +1
  4. 1 year ago

  */ 