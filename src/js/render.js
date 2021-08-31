(function($, root) {

  var $scope = $(document.body)

  // 歌曲信息
  function renderInfo(info) {
    var str = 
    '<div class="song-name">' + info.song + '</div>' +
    '<div class="singer-name">' + info.singer + '</div>' +
    '<div class="album-name">' + info.album + '</div>';
    $scope.find('.song-info').html(str);
  }

  // 歌曲图片
  function renderImg(src) {
    var img = new Image()
    img.src = src
    img.onload = function() {
      root.blurImg(img, $scope)
      $scope.find('.img-wrapper img').attr('src', src)
    }
  }

  // 是否喜欢
  function isLike(isLike) {
    if(isLike){
      $scope.find('.like-btn').addClass('liking')
    }else{
      $scope.find('.like-btn').removeClass('liking')
    }
  }

  root.render = function (data) {
    renderInfo(data)
    renderImg(data.image)
    isLike(data.isLike)
  }

})(window.Zepto, window.player || (window.player = {}))