const header=document.querySelector('[data-header]');
const scrollTopButton=document.querySelector('[data-scroll-top]');
const menuButton=document.querySelector('[data-menu]');
const nav=document.querySelector('[data-nav]');
const hero=document.querySelector('.hero');
const heroConstructorArea=document.querySelector('.hero-constructor');
const fleeingCubes=[...document.querySelectorAll('.constructor-svg .cube')];
const dropdownItems=[...document.querySelectorAll('.has-dropdown')];
const bookingModal=document.querySelector('[data-booking-modal]');
const bookingForm=document.querySelector('[data-booking-form]');
const bookingSelect=document.querySelector('[data-booking-select]');
const shapePlayground=document.querySelector('[data-shape-playground]');
const shapeCubes=[...document.querySelectorAll('.shape-cube')];

function openBooking(shift=''){
  if(!bookingModal||!bookingForm)return;
  bookingForm.reset();
  bookingForm.classList.remove('is-sent');
  const childrenField=bookingForm.elements.children;
  if(childrenField)childrenField.value='1';
  if(shift&&bookingSelect)bookingSelect.value=shift;
  bookingModal.showModal();
}

if(shapePlayground&&shapeCubes.length){
  const scatter=[[8,18,-18],[22,12,12],[37,24,-8],[53,11,16],[71,21,-20],[88,13,14],[14,42,20],[30,38,-12],[48,44,8],[66,36,18],[84,46,-16],[6,67,12],[23,72,-22],[41,62,15],[58,73,-10],[77,66,24],[92,75,-18],[18,88,8],[35,84,-15],[52,90,20],[69,86,-8],[86,91,14],[4,90,-26],[96,34,22]];
  const tree=[[50,8,0],[42,20,-3],[50,20,2],[58,20,-2],[34,32,2],[42,32,-2],[50,32,1],[58,32,3],[66,32,-3],[26,44,-2],[34,44,2],[42,44,-3],[50,44,1],[58,44,-1],[66,44,3],[74,44,-2],[30,56,2],[38,56,-2],[46,56,1],[54,56,-1],[62,56,2],[70,56,-2],[46,72,0],[54,72,0]];
  const car=[[38,24,-2],[48,24,1],[58,24,2],[38,34,1],[48,34,-1],[58,34,1],[22,46,-1],[32,46,1],[42,46,-1],[52,46,1],[62,46,-1],[72,46,1],[82,46,-1],[22,57,1],[32,57,-1],[42,57,1],[52,57,-1],[62,57,1],[72,57,-1],[82,57,1],[42,67,0],[62,67,0],[32,72,0],[72,72,0]];
  const cube=[];
  [32,41,50,59,68].forEach(x=>[22,31,40,49,58].forEach(y=>{if(!(x===50&&y===40))cube.push([x,y,(x+y)%3-1])}));
  const shapes={scatter,tree,car,cube};
  const shapeSequence=['tree','car','cube'];
  let shapeCycleIndex=0;
  let shapeCycleTimer=0;
  const setShape=name=>{
    const positions=shapes[name]||scatter;
    shapePlayground.dataset.currentShape=name;
    shapeCubes.forEach((block,index)=>{
      const [x,y,rotation]=positions[index];
      block.style.left=`${x}%`;
      block.style.top=`${y}%`;
      block.style.transform=`translate(-50%,-50%) rotate(${rotation}deg)`;
    });
  };
  setShape('scatter');
  requestAnimationFrame(()=>shapePlayground.classList.add('is-ready'));
  const startShapeCycle=()=>{
    clearInterval(shapeCycleTimer);
    shapeCycleIndex=0;
    setShape(shapeSequence[shapeCycleIndex]);
    shapeCycleTimer=setInterval(()=>{
      shapeCycleIndex=(shapeCycleIndex+1)%shapeSequence.length;
      setShape(shapeSequence[shapeCycleIndex]);
    },1700);
  };
  const stopShapeCycle=()=>{
    clearInterval(shapeCycleTimer);
    setShape('scatter');
  };
  shapePlayground.addEventListener('pointerenter',startShapeCycle);
  shapePlayground.addEventListener('pointerleave',stopShapeCycle);
  shapePlayground.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='touch')return;
    clearInterval(shapeCycleTimer);
    shapeCycleIndex=(shapeCycleIndex+1)%shapeSequence.length;
    setShape(shapeSequence[shapeCycleIndex]);
  });
}

document.querySelectorAll('.dancing-title').forEach(title=>{
  let index=0;
  const wrapText=node=>{
    [...node.childNodes].forEach(child=>{
      if(child.nodeType===Node.TEXT_NODE){
        const fragment=document.createDocumentFragment();
        [...child.textContent].forEach(char=>{
          const letter=document.createElement('span');
          letter.className=char===' '?'dancing-space':'dancing-letter';
          letter.style.setProperty('--i',index++);
          letter.textContent=char===' '?'\u00a0':char;
          fragment.append(letter);
        });
        child.replaceWith(fragment);
      }else if(child.nodeType===Node.ELEMENT_NODE){wrapText(child)}
    });
  };
  wrapText(title);
});

if(hero&&heroConstructorArea&&fleeingCubes.length&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  let repelFrame=0;
  const resetCubes=()=>{
    hero.classList.remove('is-repelling');
    fleeingCubes.forEach(cube=>{
      cube.style.setProperty('--escape-x','0px');
      cube.style.setProperty('--escape-y','0px');
    });
  };
  heroConstructorArea.addEventListener('pointermove',event=>{
    cancelAnimationFrame(repelFrame);
    repelFrame=requestAnimationFrame(()=>{
      hero.classList.add('is-repelling');
      fleeingCubes.forEach((cube,index)=>{
        const rect=cube.getBoundingClientRect();
        const centerX=rect.left+rect.width/2;
        const centerY=rect.top+rect.height/2;
        const deltaX=centerX-event.clientX;
        const deltaY=centerY-event.clientY;
        const distance=Math.max(1,Math.hypot(deltaX,deltaY));
        const radius=390;
        if(distance>=radius){
          cube.style.setProperty('--escape-x','0px');
          cube.style.setProperty('--escape-y','0px');
          return;
        }
        const force=(1-distance/radius)*220+26;
        const drift=(index%2===0?1:-1)*(1-distance/radius)*24;
        const moveX=deltaX/distance*force+drift;
        const moveY=deltaY/distance*force-drift*.35;
        cube.style.setProperty('--escape-x',`${moveX.toFixed(1)}px`);
        cube.style.setProperty('--escape-y',`${moveY.toFixed(1)}px`);
      });
    });
  });
  heroConstructorArea.addEventListener('pointerleave',resetCubes);
  header?.addEventListener('pointerenter',resetCubes);
  window.addEventListener('blur',resetCubes);
}

const updateScroll=()=>{
  const scrolled=window.scrollY>40;
  header?.classList.toggle('is-scrolled',scrolled);
  scrollTopButton?.classList.toggle('is-visible',window.scrollY>window.innerHeight*.8);
};
updateScroll();
window.addEventListener('scroll',updateScroll,{passive:true});
scrollTopButton?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
menuButton?.addEventListener('click',()=>nav?.classList.toggle('is-open'));
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>nav.classList.remove('is-open')));
dropdownItems.forEach(item=>{
  const toggle=item.querySelector('.nav-toggle');
  toggle?.addEventListener('click',event=>{
    event.stopPropagation();
    const willOpen=!item.classList.contains('is-open');
    dropdownItems.forEach(other=>{
      other.classList.remove('is-open');
      other.querySelector('.nav-toggle')?.setAttribute('aria-expanded','false');
    });
    item.classList.toggle('is-open',willOpen);
    toggle.setAttribute('aria-expanded',String(willOpen));
  });
});
document.addEventListener('click',event=>{
  if(event.target.closest('.has-dropdown'))return;
  dropdownItems.forEach(item=>{
    item.classList.remove('is-open');
    item.querySelector('.nav-toggle')?.setAttribute('aria-expanded','false');
  });
});
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  dropdownItems.forEach(item=>{
    item.classList.remove('is-open');
    item.querySelector('.nav-toggle')?.setAttribute('aria-expanded','false');
  });
});

const shiftRows=document.querySelectorAll('.shift-row');
const shiftPreview=document.querySelector('[data-shift-preview]');
const shiftPreviewImage=shiftPreview?.querySelector('img');
shiftRows.forEach(row=>{
  row.addEventListener('mouseenter',()=>{
    if(!shiftPreview||!shiftPreviewImage)return;
    shiftPreviewImage.src=row.dataset.preview;
    shiftPreview.classList.add('is-visible');
  });
  row.addEventListener('mousemove',event=>{
    if(!shiftPreview)return;
    if(event.target.closest('.shift-book-button,.shift-sold-out')){
      shiftPreview.classList.remove('is-visible');
      return;
    }
    shiftPreview.classList.add('is-visible');
    const previewX=event.clientX>window.innerWidth*.66?event.clientX-190:event.clientX+190;
    shiftPreview.style.left=`${Math.min(window.innerWidth-170,Math.max(170,previewX))}px`;
    shiftPreview.style.top=`${Math.min(window.innerHeight-130,Math.max(130,event.clientY))}px`;
  });
  row.addEventListener('mouseleave',()=>shiftPreview?.classList.remove('is-visible'));
});
window.addEventListener('scroll',()=>shiftPreview?.classList.remove('is-visible'),{passive:true});

document.querySelectorAll('.shift-book-button').forEach(button=>button.addEventListener('click',()=>{
  openBooking(button.dataset.bookingShift||'');
}));
document.querySelectorAll('.shift-book-button,.shift-sold-out').forEach(control=>control.addEventListener('pointerenter',()=>{
  shiftPreview?.classList.remove('is-visible');
}));

document.querySelectorAll('[data-booking-open]').forEach(button=>button.addEventListener('click',event=>{
  event.preventDefault();
  openBooking(button.dataset.bookingShift||'');
}));
document.querySelector('[data-booking-close]')?.addEventListener('click',()=>bookingModal?.close());
bookingModal?.addEventListener('click',event=>{if(event.target===bookingModal)bookingModal.close()});
bookingForm?.addEventListener('submit',event=>{
  event.preventDefault();
  bookingForm.classList.add('is-sent');
});

document.querySelectorAll('[data-accordion] details').forEach(item=>{
  item.addEventListener('toggle',()=>{
    if(!item.open)return;
    document.querySelectorAll('[data-accordion] details').forEach(other=>{if(other!==item)other.open=false});
  });
});

const modal=document.querySelector('[data-contact-modal]');
document.querySelector('[data-contact-open]')?.addEventListener('click',()=>modal?.showModal());
modal?.addEventListener('click',event=>{if(event.target===modal)modal.close()});
document.querySelector('[data-contact-form]')?.addEventListener('submit',event=>{
  if(event.submitter?.value==='cancel')return;
  event.preventDefault();
  modal.close();
});
