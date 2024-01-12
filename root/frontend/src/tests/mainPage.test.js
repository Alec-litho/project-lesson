import { render, screen } from '@testing-library/react'
import Main from '../pages/main-page/UserPage'

describe('main page test', () => {
  it('main page', () => {
    const [view] = render(<Main />)
  })
})
