import { render, screen } from '@testing-library/react'
import Main from '../pages/main-page/MainPage'

describe('main page test', () => {
  it('main page', () => {
    const [view] = render(<Main />)
  })
})
