const listHelper = require('../utlis/list_helper');

const wellFormedBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

describe('dummy', () => {
  test('dummy retuns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('totalLikes', () => {
  test('returns 0 when array is empty', () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test('correct number of likes when recives only one blog', () => {
    const blogs = [{ likes: 3 }];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(3);
  });

  test('adds likes correctly', () => {
    const result = listHelper.totalLikes(wellFormedBlogs);
    expect(result).toBe(36);
  });

  test('handles malformed blogs', () => {
    const blogs = [{ likes: 3 }, { name: 'foo' }];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(3);
  });

  test('handles negative likes', () => {
    const blogs = [{ likes: 3 }, { likes: -4 }];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(-1);
  });
});

describe('favoriteBlog', () => {
  test('finds correct blog', () => {
    const result = listHelper.favoriteBlog(wellFormedBlogs);
    expect(result).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    });
  });
});

describe('mostBlogs', () => {
  test('return correct object', () => {
    const result = listHelper.mostBlogs(wellFormedBlogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });

  test('handles empty arrays', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(undefined);
  });

  test('handles random string', () => {
    const result = listHelper.mostBlogs('hello world');
    expect(result).toBe(undefined);
  });

  test('handles object', () => {
    const result = listHelper.mostBlogs({});
    expect(result).toBe(undefined);
  });

  test('handles object', () => {
    const result = listHelper.mostBlogs([{ random: 2334, name: 'Quazar' }]);
    expect(result).toBe(undefined);
  });
});

describe('mostLikes', () => {
  test('return correct object', () => {
    const result = listHelper.mostLikes(wellFormedBlogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });

  test('handles empty arrays', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe(undefined);
  });

  test('handles random string', () => {
    const result = listHelper.mostLikes('hello world');
    expect(result).toBe(undefined);
  });

  test('handles object', () => {
    const result = listHelper.mostLikes({});
    expect(result).toBe(undefined);
  });

  test('handles object', () => {
    const result = listHelper.mostLikes([{ random: 2334, author: 'Quazar' }]);
    expect(result).toBe(undefined);
  });
});
