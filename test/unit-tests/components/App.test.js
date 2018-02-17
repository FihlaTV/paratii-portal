import App from 'components/App'
import createTestRenderer from 'unit-tests/test-utils/createTestRenderer'

const defaultProps = {
  match: {
    url: '/'
  },
  initializeApp: () => {}
}

const render = createTestRenderer(App, defaultProps)

describe('App component', () => {
  it('should render without crashing', () => {
    const wrapper = render()
    expect(wrapper.length).to.equal(1)
  })
})
