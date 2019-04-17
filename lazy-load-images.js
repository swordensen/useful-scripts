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
      this.loadImagesImmediately(images);
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

  applyImage(img, src){
    img.classList.add("js-lazy-image--handled");
    if (img.tagName === "IMG"){
      img.src = src
    } else {
      img.style.backgroundImage = `url('${src}')`;
    }  
    console.log("applied image", src);
  }
}

const lazyImageLoader = new LazyImageLoader();