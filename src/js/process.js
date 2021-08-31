(function($, root){
  
  var $scope = $(document.body)

  var curDuration
  var frameId 
  var lastPer = 0
  var startTime

  // 将秒转换为分
  function formatime(time) {
    time = Math.round(time)
    var minute = Math.floor(time / 60)
    var second = time - minute * 60
    if(minute < 10) {
      minute = "0" + minute
    }
    if(second < 10) {
      second = "0" + second
    }
    return minute + ":" + second
  }

  // 渲染总时间
  function renderAllTime(duration) {
    lastPer = 0
    curDuration = duration
    var allTime = formatime(curDuration)
    $scope.find('.all-time').html(allTime)
  }

  // 渲染运动的数据
  function upData(percent) {
    // 渲染初始的时间
    var curTime = percent * curDuration
    if(curTime > curDuration){
      curTime = curDuration
      $scope.find('.pro-top').css({
        'transform': 'translateX(0)'
      })
    }else{
      curTime = formatime(curTime)
      $scope.find('.cur-time').html(curTime)

      // 渲染进度条
      var percentage = (percent - 1) * 100 + '%'
      $scope.find('.pro-top').css({
        'transform': 'translateX(' + percentage + ')'
      }) 
    }
    
  }

  // 开始:   时间和进度条的改变
  function start(per) {
    lastPer = per === undefined ? lastPer : per
    cancelAnimationFrame(frameId)

    startTime = new Date().getTime()
    function frame() {
      var curTime = new Date().getTime()
      var percent = lastPer + (curTime - startTime) / (curDuration * 1000)
      frameId = requestAnimationFrame(frame)
      upData(percent)
    }
    frame()
  }

  // 暂停
  function stop() {
    var stopTime = new Date().getTime()
    lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000)
    cancelAnimationFrame(frameId)
  }

  root.process = {
    renderAllTime: renderAllTime,
    start: start,
    stop: stop,
    upData: upData
  }
})(window.Zepto, window.player || (window.player = {}))