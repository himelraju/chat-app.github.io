const startBtn = document.querySelector('.startBtn')
const checkOld = document.getElementById('checkOld')
let alertOld = document.getElementById('alert')




// checkOld & start button
checkOld.addEventListener('change',()=>{
  if(checkOld.checked == true){
      startBtn.disabled = false
      alertOld.classList.remove('show')
    }else{
      startBtn.disabled = true
      alertOld.classList.add('show')
    }
  })
  
  // =============================
  // auto typing in home
  let typingHome = document.querySelector('.typingHome')
  let sen1 = document.querySelector('.sen1')
  let sen2 = document.querySelector('.sen2')


  window.addEventListener('load',()=>{
    const firstSen = 'Who Are You..!'.split('')
    setTimeout(() => {
      let i = 0 ;
      function typing(){
        if(i < firstSen.length){
          sen1.innerHTML += firstSen[i]
          i++
          setTimeout(typing, 150);
        }
      }
      typing()
    }, 1000);
  })
  window.addEventListener('load',()=>{
    const secondSen = 'Oh..We Don\'t Care'.split('')
    setTimeout(() => {
      let i = 0 ;
      function typing2(){
        if(i < secondSen.length){
          sen2.innerHTML += secondSen[i]
          i++
          setTimeout(typing2, 150);
        }
      }
      typing2()
    }, 4000);
  })





  // const firstSen = 'Who Are You..!'.split('')
  // console.log(firstSen)
