# Mini Drive — Arayüz Geliştirme Kuralları

Bu kurallar Mini Drive projesindeki tüm arayüz geliştirme ve tasarım çalışmaları için zorunludur ve istisnasız uygulanır:

1. **Önce Dokümantasyon ve Bileşen Kontrolü:**  
   Her arayüz işi önce `DESIGN.md` ve `components/ui/` klasöründeki mevcut bileşenlere bakarak başlar.

2. **Yalnızca Mevcut Bileşenler ve Token'lar:**  
   Yeni ekranlar SADECE mevcut bileşenlerden ve token'lardan oluşur. Sabit hex renk, rastgele px değeri, sistemde olmayan gölge/yarıçap yasaktır.

3. **Eksik Bileşen Prosedürü:**  
   Bir bileşen eksikse önce `components/ui/` içine eklenir ve `/design` sayfasına işlenir, sonra kullanılır.

4. **Dört Temel Durum:**  
   Her ekranda dört durum tasarlanır:
   - Yükleniyor (`Skeleton`)
   - Boş (`EmptyState`)
   - Hata
   - Başarılı

5. **Duyarlılık ve Tema Standartları:**  
   Her ekran açık ve koyu temada, masaüstü ve mobilde (375 px) kontrol edilir.

6. **Görsel Dil Yasakları:**  
   Emoji ikon, gradyan, glow, glassmorphism ve dekoratif animasyon yasaktır. İkonlarda sadece `lucide-react` (`strokeWidth={1.75}`) kullanılır.

7. **Yazım Dili ve Tonu:**  
   Metinler kısa, sakin ve Türkçe; ünlem işareti ve pazarlama dili yok.
