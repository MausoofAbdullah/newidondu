document.addEventListener('DOMContentLoaded', function () {
    const paginationContainer = document.querySelector('.trending-pagination');

    paginationContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const page = new URL(event.target.href).searchParams.get('trendingPage');
            fetchTrendingNews(page);
        }
    });

    function fetchTrendingNews(page) {
      console.log(page,"pa")
        fetch(`/trending-news?page=${page}`)
            .then(response => response.json())
            .then(data => {
                updateTrendingNews(data.trendingNews);
                updatePagination(data.trendingPage, data.trendingTotalPages);
            })
            .catch(error => console.error('Error fetching trending news:', error));
    }

    function updateTrendingNews(news) {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';

        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'd-flex align-items-center bg-white mb-3';
            newsItem.style.height = '110px';
            newsItem.innerHTML = `
                <a href="/detailnews/${item.slug}">
                    <img class="img-fluid" src="https://res.cloudinary.com/dkeb469sv/image/upload/v1703658754/${item.image1}" style="height: 90px; width:130px;" alt="dkn" />
                    <div class="w-100 h-100 px-3 d-flex flex-column justify-content-center border border-left-0">
                        <div class="mb-2"></div>
                        <a class="h6 m-0 text-secondary text-uppercase font-weight-bold" href="/detailnews/${item.slug}">
                            ${item.title}
                           
                        </a>
                    </div>
                </a>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    function updatePagination(currentPage, totalPages) {
        paginationContainer.innerHTML = '';

        if (currentPage > 1) {
            const prevButton = document.createElement('a');
            prevButton.href = `?trendingPage=${currentPage - 1}`;
            prevButton.className = 'btn btn-primary';
            prevButton.textContent = 'Previous';
            paginationContainer.appendChild(prevButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('a');
            nextButton.href = `?trendingPage=${currentPage + 1}`;
            nextButton.className = 'btn btn-primary';
            nextButton.textContent = 'Next';
            paginationContainer.appendChild(nextButton);
        }
    }
});