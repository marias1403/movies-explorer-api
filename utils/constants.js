const validationConstants = {
  CREATE_USER_VALIDATION_ERROR: 'Переданы некорректные данные при создании пользователя',
  CREATE_USER_CONFLICT_ERROR: 'Пользователь с таким email уже существует',
  USER_NOT_FOUND_ERROR: 'Пользователь по указанному _id не найден',
  UPDATE_USER_VALIDATION_ERROR: 'Переданы некорректные данные при обновлении профиля',
  CREATE_MOVIE_VALIDATION_ERROR: 'Переданы некорректные данные при создании фильма',
  MOVIE_NOT_FOUND_ERROR: 'Фильм с указанным _id не найден',
  DELETE_MOVIE_FORBIDDEN_ERROR: 'Нет прав на удаления фильма',
  DELETE_MOVIE_VALIDATION_ERROR: 'Переданы некорректные данные при удалении фильма',
  UNAUTHORIZED_ERROR: 'Необходима авторизация',
  SERVER_ERROR: 'На сервере произошла ошибка',
  RATE_LIMIT_ERROR: 'Вы превысили количество реквестов за сутки!',
  URL_JOI_VALIDATION_ERROR: 'Неправильный формат ссылки',
  EMAIL_PASSWORD_UNAUTHORIZED_ERROR: 'Неправильные почта или пароль',
  ROUTE_NOT_FOUND_ERROR: 'Маршрут не найден',
};

module.exports = validationConstants;
