import { LRUCache } from "lru-cache";
import NewsModel from "../models/newsModel.js";

// Set up the LRU cache
const options = {
  max: 500, // Maximum number of items in the cache
  maxAge: 1000 * 60 * 60 // Cache expiration time in milliseconds (1 hour)
};
const cache = new LRUCache(options);

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const { slug } = req.params;

  if (cache.has(key)) {
    console.log('Serving from cache');
    res.send(cache.get(key));

    // Check if the article has been viewed in the current session
    if (!req.session.viewedArticles) {
      req.session.viewedArticles = {};
    }
    if (!req.session.viewedArticles[slug]) {
      incrementViewCount(slug).catch(console.error);
      req.session.viewedArticles[slug] = true;
    }

    return;
  } else {
    console.log("Not cached");
    res.sendResponse = res.render;
    res.render = (view, options, callback) => {
      res.sendResponse(view, options, (err, html) => {
        if (!err) {
          cache.set(key, html);

          // Check if the article has been viewed in the current session
          if (!req.session.viewedArticles) {
            req.session.viewedArticles = {};
          }
          if (!req.session.viewedArticles[slug]) {
            incrementViewCount(slug).catch(console.error);
            req.session.viewedArticles[slug] = true;
          }
        }
        res.send(html);
      });
    };
    next();
  }
};

// Function to increment the view count
const incrementViewCount = async (slug) => { 
  const news = await NewsModel.findOne({ slug });
  if (news) {
    news.views += 1;
    await news.save();
  }
};
export default cacheMiddleware
