import Vue from 'vue'
export default {
  install(){
    Vue.directive('noMoreClick', {
      inserted(el, binding) {
        el.addEventListener('click', e => {
          el.classList.add('is-disabled')
          el.disabled = true
          setTimeout(() => {
            el.disabled = false
            el.classList.remove('is-disabled')
          }, 500)
        })
      }
    })
  }
}
