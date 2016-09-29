var likes_keeper = $('.post-likes');

if (typeof likes_keeper.data('slug') == "string") {
    likes_keeper.find('img').click(function () {
        $.post({
            url    : '/likes-post',
            data   : {
                slug: likes_keeper.data('slug')
            },
            success: function (data) {
                if (data.likes) {
                    likes_keeper.find('span').text(data.likes);
                }
                if (data.message) {
                    console.log(data.message);
                }
            }
        });
    });
}


