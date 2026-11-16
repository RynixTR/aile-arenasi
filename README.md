# Aile Arenası

Türkçe, mobil öncelikli, 2–5 kişilik gerçek zamanlı aile oyun platformu. Tek Node.js servisi React arayüzünü ve Socket.IO bağlantısını sunar. Maç durumu, oyuncular, cevaplar ve puanlar PostgreSQL'de tutulur. Üyelik gerekmez.

## Oyunlar

Bilgi Arenası, Aramızdaki Casus, Çiz Bakalım, Sessiz Sinema, Kelime Savaşı, Ailede Kim?, Hafıza Savaşı, Fiyatı Bil, Yasaklı Kelime ve Şans Çarkı. İki kişilik maçlarda en az üç kişi gerektiren Casus oyunu atlanır; diğer dokuz oyun oynanır. Üç ila beş kişiyle on oyunun tamamı oynanır.

## Yerel çalıştırma

Node.js 22+ ve PostgreSQL 15+ gerekir.

1. `npm install`
2. `.env.example` dosyasını `.env` olarak kopyalayın; `DATABASE_URL` ve uzun rastgele `SESSION_SECRET` değerlerini girin.
3. `npx prisma generate`
4. `npx prisma migrate deploy`
5. `npm run db:seed`
6. `npm run dev`

Tarayıcıda `http://localhost:5173` adresini açın. Vite, `/api` ve `/socket.io` isteklerini 3001 portundaki sunucuya yönlendirir. Aynı bilgisayarda farklı oyuncuları denemek için ayrı tarayıcı profilleri veya gizli pencereler kullanın. Telefonlardan bağlanırken `CLIENT_URL` değişkenine bilgisayarın ağ adresindeki Vite URL'sini de ekleyin ve iki portu ağda erişilebilir tutun.

Üretim yapısını yerelde denemek için `npm run build && npm run start`; bu komut migration ve seed işlemlerini yapıp tek sunucuyu `PORT` üzerinde açar. `GET /health` veritabanı bağlantısını denetler.

## Render dağıtımı

Git deposunu Render'a bağlayıp kökteki `render.yaml` ile Blueprint oluşturun. Blueprint bir **Free Web Service** ve bir **Free Render Postgres** açar. `DATABASE_URL` veritabanından otomatik bağlanır, `SESSION_SECRET` oluşturulur. Build komutu `npm install --include=dev && npx prisma generate && npm run build`, start komutu `npm run start`tır. `--include=dev`, üretim ortamında Vite ve TypeScript'in build sırasında kurulmasını sağlar. Free Web Service için pre-deploy komutu desteklenmediğinden migration ve idempotent seed, start sırasında çalışır. İlk açılışta birkaç saniye ekleyebilir. Canlı adreste `/health` yanıtını ve iki telefondan oda/Socket.IO bağlantısını kontrol edin.

`CLIENT_URL` sadece başka originlerden gelen tarayıcıları sınırlamak isterseniz ayarlanır. Aynı Render servisinden açılan uygulama için gerekmez. Ayarlanırsa virgülle ayrılmış izinli adresler kabul edilir. `NODE_ENV=production`, `PORT` Render tarafından sağlanır. `SESSION_SECRET` kaynak koda yazılmaz.

Render'ın güncel [Free servis açıklamasına](https://render.com/docs/free) göre ücretsiz web servisi, 15 dakika gelen HTTP isteği veya WebSocket mesajı almazsa uyur; sonraki istek soğuk başlatma yapar. Etkin WebSocket mesajları uyumayı önler. Ücretsiz PostgreSQL veritabanı 30 gün sonra sona erer; kalıcı kullanım için ücretli plana geçmek gerekir. [WebSocket dokümantasyonu](https://render.com/docs/websocket) sabit bağlantı süresi sınırı koymadığını, ancak yeniden başlatma ve ağ kopmalarının bağlantıyı kesebileceğini belirtir. Uygulama Socket.IO ile yeniden bağlanır; maç durumu PostgreSQL'den yüklenir. Free PostgreSQL planının bağlantı limiti ve diğer güncel kotaları için [Render plan tablosunu](https://render.com/pricing) kontrol edin. Bu depo Render'a otomatik yayınlanmış değildir; canlı WebSocket çalışması dağıtımdan sonra doğrulanmalıdır.

## Doğrulama

`npm test` içerik havuzu boyutlarını, 5 oyuncu sınırını, iki kişilik başlangıcı, gizli bilgilerin ayrılmasını, çift cevabın reddini, puan hesaplamasını, sahip değişimini ve 10 oyunun tur kurulumundan şampiyonluk aşamasına kadar akışını test eder. `npm run build` TypeScript ve Vite derlemesini doğrular. `npx playwright test` Chrome'da ana sayfa, katılım formu ve on oyun ekranının 360 piksel genişlikte yatay taşmadığını kontrol eder. Bu testler veritabanı davranışını taklit eder; gerçek PostgreSQL ve Render üzerinde çok cihazlı uçtan uca test ayrıca yapılmalıdır.

## Güvenlik ve veri

Oyuncu tokenları 32 rastgele bayttır; veritabanında yalnızca `SESSION_SECRET` ile üretilmiş HMAC-SHA-256 özeti tutulur. Sunucu socket oturumlarını doğrular, oda kodlarını rastgele üretir, istekleri sınırlar, mesajları Zod ile doğrular, puanları kendisi hesaplar ve gizli kelimeleri yalnızca ilgili oyuncuya gönderir. Uygun olmayan oyuncu girdileri temizlenir. Fiyat oyunu yaklaşık örnek fiyatlar kullanır; piyasa fiyatı olarak yorumlanmamalıdır. Ürün çizimleri yerel SVG varlıklarıdır.

Kelime Savaşı sözlüğü, [Zemberek-NLP ana sözlüğünden](https://github.com/ahmetaa/zemberek-nlp) alınan tek sözcüklü girdileri ve oyun içeriğindeki sözcükleri kullanır. Sözlük Apache 2.0 lisansı kapsamındadır; lisans metni `server/src/ZEMBEREK-LICENSE.txt` içindedir. Sözlükte uygunsuz içerik filtresi uygulanır.
