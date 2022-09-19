axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.baseURL = "https://syd-kilroy-api.herokuapp.com/";

const vueApp = new Vue({
  el: "#main",
  mixins: [Vue2Filters.mixin],
  data: {
    display: "redbox",
    textLoaded: false,
    resumeLoaded: false,
    photos: [],
    currentPhotos: [],
    photoIndex: 0,
    resume: [],
    text: {},
  },
  created: function () {
    this.indexPhotos();
    
  },
  onload: function () {
  },
  methods: {
    indexPhotos: function () {
      axios.get("/api/photos").then((response) => {
        console.log("photos index", response);
        let unfiltered = response.data;
        let ordered = unfiltered.sort((a, b) => a["index"] - b["index"])
        let tmp = []
        for (let i = 0; i < ordered.length; i++) {
          if (tmp.length > 0 && tmp.length % 6 === 0 || i === ordered.length - 1) {
            this.photos.push(tmp)
            tmp = []
          }
          else {
            tmp.push(ordered[i])
          }
        }
        // console.log("photos", this.photos)
        this.currentPhotos = this.photos[0]
        // console.log(this.photos[0])
        this.getText();
      });
    },

    getText: function () {
      axios.get("/api/text").then((response) => {
        let textArr = response.data;
        textArr.forEach((element) => {
          this.text[element.name] = element.body;
        });
        this.getResume();

        main.initViewer();
        this.fixSlide();
      });
    },

    getResume: function () {
      axios.get("/api/resume").then((response) => {
        this.resume = response.data;
        this.resume.forEach((entry) => {
          var endDate = (entry.dates.includes(" - ") ? entry.dates.split(" - ")[1] : entry.dates.split("-")[1]).toLowerCase();
          if (endDate == "present") {
            entry.index = 3000
          } else if(endDate.includes(' ')) {
            var endDateArr = endDate.split(" ");
            let seasonIndex = 0.0;
            switch (endDateArr[0]) {
              case "spring":
                seasonIndex = 0.25;
                break;
              case "summer":
                seasonIndex = 0.5;
                break;
              case "fall":
                seasonIndex = 0.75;
                break;
              case "winter":
                seasonIndex = 1.0;
                break;
            }
            entry.index = parseFloat(endDateArr[1]) + seasonIndex;
          }
          else {
            entry.index = parseInt(endDate);
          }
        });
      });
    },

    fixSlide: function () {
      let firstPhoto = this.currentPhotos.find((photo) => photo.index === 1);
      var oldSlide = main.current !== null ? main.slides[main.current] : null,
        newSlide = main.slides[1];
      oldSlide.$parent.removeClass("active");
      oldSlide.$slide.removeClass("active");
      newSlide.$parent.addClass("active").focus();
      newSlide.$slide.appendTo(main.$viewer);
      newSlide.loaded = true;
      newSlide.$slide.addClass("active");
      newSlide.$slideImage.css(
        "background-image",
        "url(" + firstPhoto.image_url + ")"
      );
      main.current = 1
    },

    currentArr: function () {
      console.log(this.photos)
      this.currentPhotos = this.photos[this.photoIndex]
    }
  },
});
