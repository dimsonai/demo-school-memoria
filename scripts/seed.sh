#!/bin/bash
# Seeds the "Снегопад" archive with demo albums, wishes and festive media.
set -u
BASE="${SEED_BASE:-http://127.0.0.1:3000}"
MEDIA=/tmp/seedmedia
mkdir -p "$MEDIA"

existing=$(curl -s --max-time 15 "$BASE/api/memories" | grep -o '"id"' | wc -l | tr -d ' ')
if [ "${existing:-0}" -gt 0 ]; then
  echo "== archive already has $existing memories, skipping seed =="
  exit 0
fi

dl() { # url file
  if [ ! -s "$MEDIA/$2" ]; then
    echo "downloading $2"
    curl -fL --retry 2 --max-time 180 -o "$MEDIA/$2" "$1" || echo "DOWNLOAD FAILED: $2"
  fi
}

fetch_video() { # url file
  local len
  len=$(curl -sIL --max-time 30 "$1" | grep -i '^content-length' | tail -1 | tr -dc '0-9')
  echo "video $2 size: ${len:-unknown}"
  if [ -n "$len" ] && [ "$len" -gt 90000000 ]; then
    echo "skip $2 (too large)"
    return 1
  fi
  dl "$1" "$2"
}

echo "== downloading media =="
dl "https://images.pexels.com/photos/6405776/pexels-photo-6405776.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p1.jpg
dl "https://images.pexels.com/photos/6405778/pexels-photo-6405778.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p2.jpg
dl "https://images.pexels.com/photos/6405748/pexels-photo-6405748.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p3.jpg
dl "https://images.pexels.com/photos/6405772/pexels-photo-6405772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p4.jpg
dl "https://images.pexels.com/photos/5778903/pexels-photo-5778903.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p5.jpg
dl "https://images.pexels.com/photos/5779172/pexels-photo-5779172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p6.jpg
dl "https://images.pexels.com/photos/5779174/pexels-photo-5779174.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p7.jpg
dl "https://images.pexels.com/photos/3171768/pexels-photo-3171768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" p8.jpg

fetch_video "https://videos.pexels.com/video-files/5866490/5866490-hd_1920_1080_25fps.mp4" v1.mp4
fetch_video "https://videos.pexels.com/video-files/6185223/6185223-hd_1920_1080_24fps.mp4" v2.mp4 \
  || fetch_video "https://videos.pexels.com/video-files/6185223/6185223-sd_960_540_24fps.mp4" v2.mp4 \
  || echo "no v2"
fetch_video "https://videos.pexels.com/video-files/29912471/12839235_3240_2160_30fps.mp4" v3.mp4 || echo "no v3"

echo "== creating albums =="
mkalbum() {
  curl -sf --max-time 20 -X POST "$BASE/api/albums" \
    -H 'Content-Type: application/json' -d "$1" >/dev/null && echo "album ok" || echo "album FAILED"
}
mkalbum '{"title":"Новогодняя ночь","description":"Салют, бенгальские огни и счастливые лица в первую ночь года"}'
mkalbum '{"title":"За праздничным столом","description":"Ужин, тосты и разговоры до самого утра"}'
mkalbum '{"title":"Зимнее волшебство","description":"Ёлка, гирлянды и уютные зимние вечера"}'

echo "== uploading memories =="
up() { # file albumId author caption
  [ -s "$MEDIA/$1" ] || { echo "missing $1, skipped"; return 0; }
  curl -sf --max-time 300 -X POST "$BASE/api/memories" \
    -F "files=@$MEDIA/$1" -F "albumId=$2" -F "author=$3" -F "caption=$4" >/dev/null \
    && echo "uploaded $1" || echo "UPLOAD FAILED $1"
}

up p1.jpg 1 "Маша" "Бенгальские огни и смех — идеальное комбо"
up p3.jpg 1 "Саша" "Зажигаем Новый год!"
up p2.jpg 1 "Дима" "Тост за нас, друзья"
up p5.jpg 1 "Лена" "Тёплый свет и самые родные лица"
up p4.jpg 1 "Кирилл" "Главное — что мы вместе"
up p6.jpg 2 "Маша" "Наш праздничный стол в этом году"
up p7.jpg 2 "Оля" "Все в сборе — начинаем!"
up v1.mp4 2 "Лена" "Накрываем на стол за минуту до гостей"
up p8.jpg 3 "Саша" "Момент, когда все загадывают желания"
up v3.mp4 3 "Дима" "Ёлка этого года — как вам?"
up v2.mp4 1 "Маша" "Наш ужин глазами ёлки"

echo "== posting wishes =="
wish() { # author text
  curl -sf --max-time 20 -X POST "$BASE/api/wishes" \
    -H 'Content-Type: application/json' \
    -d "{\"author\":\"$1\",\"text\":\"$2\"}" >/dev/null && echo "wish ok" || echo "wish FAILED"
}
wish "Маша" "Пусть в новом году каждый из нас найдёт то, что ищет, а наши встречи станут ещё чаще и ещё теплее. Люблю вас!"
wish "Дима" "Желаю нам побольше таких вечеров: когда смех громче музыки, а время летит незаметно. С Новым годом, дорогие!"
wish "Лена" "Пусть все планы сбудутся, мечты осуществятся, а мы соберёмся здесь снова и вспомним, как всё начиналось."
wish "Саша" "Здоровья нашим близким, смелости нам и новых совместных приключений. Этот год точно будет нашим!"
wish "Оля" "Спасибо, что вы есть. Пусть снег за окном заметает все тревоги, оставив только светлое."

echo "== done =="
curl -s --max-time 15 "$BASE/api/memories" | grep -o '"id"' | wc -l
