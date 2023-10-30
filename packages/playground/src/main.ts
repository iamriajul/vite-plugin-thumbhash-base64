import './style.css'
import unoptimized1 from './un-optimized.jpg'
import unoptimized2 from './un-optimized.jpg?thumb'
import { setupCounter } from './counter'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Example</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <img data-hash=${unoptimized2} class="thumb" />
    <img src=${unoptimized1} />
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
