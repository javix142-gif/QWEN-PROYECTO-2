(function(){
  'use strict';

  const LEVELS={
    easy:{label:'Fácil',hint:'Velocidad cómoda',factor:1.28,minDelay:92},
    medium:{label:'Medio',hint:'Velocidad equilibrada',factor:1,minDelay:68},
    hard:{label:'Difícil',hint:'Ritmo rápido',factor:.72,minDelay:46}
  };

  const nativeGet=Storage.prototype.getItem;
  const nativeSet=Storage.prototype.setItem;
  const nativeSetTimeout=window.setTimeout.bind(window);

  function readDifficulty(){
    try{
      const saved=nativeGet.call(localStorage,'snakeDifficulty');
      return LEVELS[saved]?saved:'medium';
    }catch(_){return 'medium'}
  }

  let difficulty=readDifficulty();

  // Conserva el récord previo como récord del nivel medio.
  try{
    const legacy=nativeGet.call(localStorage,'snakeBest');
    const medium=nativeGet.call(localStorage,'snakeBest:medium');
    if(legacy!==null&&medium===null) nativeSet.call(localStorage,'snakeBest:medium',legacy);
  }catch(_){}

  Storage.prototype.getItem=function(key){
    if(key==='snakeBest') key=`snakeBest:${difficulty}`;
    return nativeGet.call(this,key);
  };

  Storage.prototype.setItem=function(key,value){
    if(key==='snakeBest') key=`snakeBest:${difficulty}`;
    return nativeSet.call(this,key,value);
  };

  window.setTimeout=function(callback,delay,...args){
    let adjusted=delay;
    if(typeof callback==='function'&&callback.name==='step'&&Number.isFinite(delay)){
      const config=LEVELS[difficulty];
      adjusted=Math.max(config.minDelay,Math.round(delay*config.factor));
    }
    return nativeSetTimeout(callback,adjusted,...args);
  };

  function buildDifficultyMenu(){
    const header=document.querySelector('.header');
    if(!header||document.getElementById('difficultyPanel'))return;

    const panel=document.createElement('section');
    panel.id='difficultyPanel';
    panel.className='difficulty-panel';
    panel.setAttribute('aria-label','Nivel de dificultad');
    panel.innerHTML=`
      <div class="difficulty-copy">
        <span class="difficulty-kicker">Dificultad</span>
        <strong id="difficultyLabel"></strong>
        <small id="difficultyHint"></small>
      </div>
      <div class="difficulty-selector" role="group" aria-label="Seleccionar dificultad">
        <button class="difficulty-btn" type="button" data-level="easy">Fácil</button>
        <button class="difficulty-btn" type="button" data-level="medium">Medio</button>
        <button class="difficulty-btn" type="button" data-level="hard">Difícil</button>
      </div>`;
    header.insertAdjacentElement('afterend',panel);

    const label=panel.querySelector('#difficultyLabel');
    const hint=panel.querySelector('#difficultyHint');
    const buttons=[...panel.querySelectorAll('[data-level]')];
    const startButton=document.getElementById('btnStart');

    function render(){
      const config=LEVELS[difficulty];
      label.textContent=config.label;
      hint.textContent=config.hint;
      buttons.forEach(button=>{
        const active=button.dataset.level===difficulty;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',String(active));
      });
    }

    function syncDisabled(){
      const playing=Boolean(startButton&&startButton.disabled);
      buttons.forEach(button=>{button.disabled=playing});
      panel.classList.toggle('locked',playing);
    }

    buttons.forEach(button=>{
      button.addEventListener('click',()=>{
        const selected=button.dataset.level;
        if(!LEVELS[selected]||selected===difficulty)return;
        difficulty=selected;
        try{nativeSet.call(localStorage,'snakeDifficulty',selected)}catch(_){}
        location.reload();
      });
    });

    if(startButton){
      new MutationObserver(syncDisabled).observe(startButton,{attributes:true,attributeFilter:['disabled']});
    }

    render();
    syncDisabled();

    const overlaySub=document.getElementById('overlaySub');
    if(overlaySub){
      overlaySub.textContent=`Nivel ${LEVELS[difficulty].label.toLowerCase()}. Toca el tablero, desliza o usa las flechas para comenzar.`;
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',buildDifficultyMenu,{once:true});
  }else{
    buildDifficultyMenu();
  }
})();
