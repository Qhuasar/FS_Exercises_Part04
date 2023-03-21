const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce(
  (prevVal, blog) => (blog.likes ? blog.likes + prevVal : prevVal + 0),
  0,
);

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const mostLikes = Math.max(...likes);
  return blogs.find((blog) => blog.likes === mostLikes);
};

const mostBlogs = (blogs) => {
  // check parameter for Blog type objects and determines which author as the most blogs
  try {
    const authors = blogs.map((blog) => blog.author);
    let authorObjs = [];
    authors.forEach((author) => {
      const authorObj = authorObjs.find((obj) => author === obj.author);
      // check if author is already in obj arry and if author exists
      if (authorObj === undefined && author) {
        authorObjs = authorObjs.concat({ author, blogs: 1 });
      } else if (author !== undefined) {
        authorObj.blogs += 1;
      }
    });
    const mostblogs = Math.max(...authorObjs.map((obj) => obj.blogs));
    return authorObjs.find((obj) => obj.blogs === mostblogs);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const mostLikes = (blogs) => {
  try {
    let likesObjs = [];
    blogs.forEach((blog) => {
      const likeObj = likesObjs.find((obj) => blog.author === obj.author);
      if (likeObj === undefined && blog.author && blog.likes) {
        likesObjs = likesObjs.concat({
          author: blog.author,
          likes: blog.likes,
        });
      } else if (blog.author) {
        likeObj.likes += blog.likes;
      } else {
        throw new Error('Object missing proprieties');
      }
    });
    const maxLikes = Math.max(...likesObjs.map((obj) => obj.likes));
    return likesObjs.find((obj) => obj.likes === maxLikes);
  } catch (error) {
    console.error(error.message);
    return undefined;
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
