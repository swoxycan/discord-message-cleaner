# Discord Message Cleaner

Bu proje, Discord'daki özel mesajlarınızı (DM) ve sunuculardaki mesajlarınızı toplu olarak silmenize yardımcı olur.

## ⚠️ Yasal Uyarı
Bu araç, Discord'un hizmet şartlarına aykırı olabilir. Kendi hesabınızı riske atabileceğinizi unutmayın. Kullanmadan önce dikkatlice düşünün!

## 🚀 Özellikler
- Arkadaş listenizdeki DM'leri topluca siler.
- Bulunduğunuz sunuculardaki mesajları topluca siler.
- Silinen mesajları `log.txt` dosyasına kaydeder.
- Silme işlemleri arasında belirli bir gecikme süresi uygular.

## 📌 Gereksinimler
Bu projeyi çalıştırmak için aşağıdaki gereksinimlere ihtiyacınız vardır:
- Node.js (v16 veya üzeri)
- `config.json` dosyası (token bilgisi içermelidir)

## 🔧 Kurulum
1. **Projeyi klonlayın:**
   ```sh
   git clone https://github.com/swoxycan/discord-message-cleaner.git
   cd discord-message-cleaner
   ```

2. **Run.bat**
   ```sh
   run.bat'ı çalıştırın.
   ```

3. **`config.json` dosyanızı oluşturun:**
   ```json
   {
     "token": "DISCORD_TOKENINIZ",
     "userId": "KULLANICI_ID"
   }
   ```

4. **Uygulamayı çalıştırın:**
   ```sh
   node index.js
   ```

## 📜 Kullanım
Bu araç çalıştırıldığında otomatik olarak:
1. Arkadaş listenizdeki tüm DM'leri alır ve mesajları siler.
2. Bulunduğunuz sunucuları tarar ve mesajları siler.
3. Tüm işlemleri `log.txt` dosyasına kaydeder.

## ⚠️ Dikkat Edilmesi Gerekenler
- **Bu işlem geri alınamaz!**
- Discord API kullanım limitlerine takılmamak için `delay` ayarı bulunmaktadır. Çok düşük bir değer ayarlarsanız hesabınız risk altında olabilir.
- **Bu aracı yalnızca kendi hesabınızda kullanın!** Başka kullanıcıların verilerine müdahale etmek yasal sorumluluk doğurabilir.

## 📄 Lisans
Bu proje açık kaynaklıdır ve [MIT Lisansı](LICENSE) ile lisanslanmıştır.
