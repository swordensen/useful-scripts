class LazyImageLoader {

  constructor(){
    this.images = document.querySelectorAll("[data-src]");
    this.imageCount = this.images.length;
    this.config = {
      rootMargin: "50px 0px",
      threshold: 0.01
    };
    this.main();
  }

  main(){
    // if intersection observer doesn't exist just load the image
    if (typeof window["IntersectionObserver"] === "undefined") {
      this.loadImagesImmediately(this.images);
    } else {
      // create the observer
      this.observer = new IntersectionObserver(this.onIntersection.bind(this), this.config);

      this.images.forEach(image => {
        if(!image.classList.contains("js-lazy-image--handled")){
          this.observer.observe(image);
        }
      })
    }
  }


  fetchImage(url){
    return new Promise(function(resolve, reject) {
      var image = new Image();
      image.src = url;
      image.onload = resolve;
      image.onerror = reject;
    });
  }

  preloadImage(image){
    if (image !== "0") {
      var src = image.getAttribute("data-src");
    }
    if (!src) {
      return;
    }
  
    return this.fetchImage(src).then(()=> {
      this.applyImage(image, src);
    });
  }

  loadImagesImmediately(images){
    for (var i = 0; i < this.imageCount; i++) {
      this.preloadImage(images[i]);
    }
  }

  onIntersection(entries){
    if (this.imageCount === 0) {
      this.observer.disconnect();
    }
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        this.imageCount--;
        this.observer.unobserve(entry.target);
        this.preloadImage(entry.target);
      }
    });
  }

  createSVG(img,src){
    var imgID = img.getAttribute('id');
    var imgClass = img.getAttribute('class');
    var requestSVG = new XMLHttpRequest();
    requestSVG.open('GET', src, true);
    requestSVG.send();

    requestSVG.onload = function(e) {
        if (requestSVG.status >= 200 && requestSVG.status < 400) {
            // Success!
            var svg = requestSVG.responseXML.querySelector('svg');
            svg.getAttribute('xmlns:a') && svg.removeAttr('xmlns:a');

            if (imgID ) {
                svg.setAttribute('id', imgID);
            }

            if ( imgClass ) {
                svg.setAttribute('class', imgClass + ' replaced-svg');
            }

            img.replaceWith(svg);
        } 
    }
}

  
  
  applyImage(img, src){
    img.classList.add("js-lazy-image--handled");
    if (img.tagName === "IMG"){
      if (img.classList.contains('svg')) {
          this.createSVG(img, src);
      }else{
          img.src = src;
      }
    } else {
      img.style.backgroundImage = `url('${src}')`;
    }  
    console.log("applied image", src);
    
    document.body.classList.add('lazy-loaded');
  }
}

const lazyImageLoader = new LazyImageLoader();