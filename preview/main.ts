import '../resources/css/app.css'

import { createApp, h } from 'vue'
import HomePage from '../resources/js/pages/home/home_page.vue'
import { homePageFixture } from './fixtures/home_page.fixture'

const mountPoint = document.getElementById('app')

if (mountPoint === null) {
  throw new Error('Preview mount point #app is missing')
}

createApp({ render: () => h(HomePage, homePageFixture) }).mount(mountPoint)
