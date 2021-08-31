var $ = window.Zepto
var root = window.player
var $scope = $(document.body)

var index = 0;
var songList;
var audio = new root.audioControl();


function bindEvent() {  
  // $scope.on('play:change', function(index) {
  //   audio.getAudio(songList[index].audio);
  //   if(audio.status == 'play'){
  //     audio.play();
  //   }
  // })

  // 喜欢
  $scope.on('click', '.like-btn', function() {
    $scope.find('.like-btn').toggleClass('liking')
  }) 

  // 上一首
  $scope.on('click', '.prev-btn', function() {
    // 轮播图
    if(index === 0){
      index = songList.length - 1
    }else{
      index --;
    }
    root.render(songList[index])

    // 歌曲时长
    root.process.renderAllTime(songList[index].duration);

    // 上一首自动播放
    audio.getAudio(songList[index].audio)
    audio.play()
    $scope.find('.play-btn').addClass('playing')

    // 清空进度条
    root.process.start()
    root.process.upData(0)
  })

  // 下一首
  $scope.on('click', '.next-btn', function() {
    // 轮播图
    if(index === songList.length - 1){
      index = 0
    }else{
      index ++;
    }

    root.render(songList[index])
    
    // 歌曲时长
    root.process.renderAllTime(songList[index].duration);
    
    // 下一首自动播放
    audio.getAudio(songList[index].audio)
    audio.play()
    $scope.find('.play-btn').addClass('playing')

    // 清空进度条
    root.process.start()
    root.process.upData(0)
  })

  // 播放
  $scope.on('click', '.play-btn', function() {
    if(audio.status == 'play'){
      audio.pause()
      root.process.stop()
      $scope.find('.play-btn').removeClass('playing')
    }else{
      audio.getAudio(songList[index].audio)
      audio.play()
      root.process.start()
      $scope.find('.play-btn').addClass('playing')
    }
  })

}

// 拖拽进度条
function bindTouch() {
  var $slider = $scope.find('.slider-pointer')
  var offset = $scope.find('.pro-wrapper').offset()
  var left = offset.left
  var width = offset.width

  $slider.on('touchstart', function() {
    root.process.stop()
  }).on('touchmove', function(e) {
    var x = e.changedTouches[0].clientX
    var per = (x - left) / width  
    if(per < 0 || per > 1) {
      per = 0
    }
    root.process.upData(per)
  }).on('touchend', function(e) {
    var x = e.changedTouches[0].clientX
    var per = (x - left) / width  
    if(per < 0 || per > 1) {
      per = 0
    }
    var curDuration = songList[index].duration 
    var curTime = per * curDuration
    audio.playTo(curTime)
    root.process.start(per)
    $scope.find('.play-btn').addClass('playing')
  })
}

// 获取数据
function getData(dataUrl) {
  $.ajax ({
    type: "GET",
    url: dataUrl,
    success: function(data) {
      songList = data
      root.render(songList[0]);
      console.log(root);
      root.process.renderAllTime(songList[index].duration);
      bindEvent();
      bindTouch();
      
      // $scope.trigger('play:change', 0);
      // console.log(data);
    },
    error: function() {
      console.log("error");
    }
  })
}

getData("../mock/data.json");