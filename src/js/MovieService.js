import { db } from 'baqend/realtime'

class MovieService {



    /**
     * Loads a specific movie by title
     * @param {string} [title] The movie title
     */
    loadMovieByTitle(title) {
        //TODO
        let query = db.Movie.find()
            .where({ 'title': title})
			.sort({ 'id': -1 })
            .limit(1);
        return query;
    }

    loadAllMovies(limit){
       let query = db.Movie.find()
            .where({ 'id': { '$exists' : true } })
            .sort({ 'id': -1 })
            .limit(new Number(limit));
       return query;
    }
    /**
     * Loads movie suggestions for the typeahead input
     * @param {string} [title] The movie title
     */
    loadMoviesByPrefix(prefix, limit){
        var pattern = "^" + prefix;
        let query = db.Movie.find()
            .where({'title': {$regex: pattern}})
            .sort({'id': -1 })
            .limit(new Number(limit));
        return query;
    }

    loadMoviesByGenre(genre, limit){
        let query = db.Movie.find()
            .where({'genre': {'$in': genre.split(',')}})
            .sort({'id': -1 })
            .limit(new Number(limit));
        return query;
    }

    loadMoviesByRatingGt(rating,limit){
        let query = db.Movie.find()
            .where({'rating': {$gt: parseInt(rating)}})
            .sort({'id': -1 })
            .limit(new Number(limit));
        return query;
    }

    loadMoviesByGenrePartialMatch(genre, limit){
        var pattern = "^" + genre;
        let query = db.Movie.find()
            .where({'genre': {$regex: pattern}})
            .sort({'id': -1 })
            .limit(new Number(limit));
        return query;
    }

    loadMoviesByReleasedDateCountry(country, limit){
        var isodate = new Date("1950-01-01T01:00:00Z").getTime();
        console.log(isodate)
        let query = db.Movie.find()
            .where({'releases':{ $elemMatch: {'date': {$lte:{'$date': isodate}}, 'country': country}}})
            .sort({'id': -1 })
            .limit(new Number(limit));
        console.log(query)
        return query;
    }

    loadMoviesByUserComment(username, limit){
        let comment= this.commentsByUser(username);
        console.log(comment)
        let query = db.Movie.find()
            .where({'id': {$in: comment.toArray()}})
            .sort({ 'id': -1 })
            .limit(new Number(limit));
        return query;
    }

    commentsByUser(username) {
        let query = db.MovieComment.find()
            .where({"username": username})
        return query.toArray();
    }
    /**
     * Queries movies filtered by the query arguments
     * @param {Object} [args] The query arguments
     * @param {string} [args.type=prefix|rating-greater|genre|genrePartialmatch|release|comments] The query type
     * @param {string} [args.parameter] The query parameter
     * @param {string} [args.limit=10] Max results
     */
    queryMovies(args) {
        let query;
        switch (args.type) {
            case 'show-all':
                query = this.loadAllMovies(args.limit);
                break;
            case 'genre':
                query = this.loadMoviesByGenre(args.parameter, args.limit);
                break;
            case 'prefix':
                query= this.loadMoviesByPrefix(args.parameter, args.limit);
                break;
            case 'full-title':
                query = this.loadMovieByTitle(args.parameter);
                break;
            case 'rating-greater':
                query = this.loadMoviesByRatingGt(args.parameter, args.limit);
                break;
            case 'genrePartialmatch':
                query = this.loadMoviesByGenrePartialMatch(args.parameter, args.limit);
                break;
           /* case 'release':
                query = this.loadMoviesByReleasedDateCountry(args.parameter, args.limit);
                break;
            case 'comments':
                query = this.loadMoviesByUserComment(args.parameter, args.limit);
                break; */
        }
        return query.resultList();
    }

}

export default new MovieService()
