var express = require('express')
var router = express.Router()
const path = require('path');     
var appDir = path.dirname(require.main.filename);
const e = require('thenify');     // moduł umożliwiający obsługę Promise przez klasyczne metody Node.js
const thenify = require('thenify');
const fs = require('fs');
const base = path.join(appDir, "/uploads/");


router.use( function(request,response){

		
	 // dla każdego żądania wywoływana jest nasza metoda, otrzymujemy dwa obiekty: request i response
    //   - request - obiekt IncomingMessage (https://nodejs.org/api/http.html#http_class_http_incomingmessage)
    //   - response - obiekt ServerResponse (https://nodejs.org/api/http.html#http_class_http_serverresponse)
    //
    // Obiekt request jest strumieniem, po którym przeglądarka będzie wysyłała do nas plik.

    // obiekt request zawiera informację o żądanym przez przeglądarkę adresie
    // na wszelki wypadek wykonujemy na nim regex, który uniemożliwi wgranie pliku poza ustaloną wyżej ścieżkę
    const name = request.url.replace(/[^\/\w\d]+/g, '-').match(/([\-\w\d\.]+)\/([\-\w\d\.]+)$/);

    // sprawdzamy, czy klient podał właściwy URL i czy chce nam wysłać plik (czyli, czy wykonuje metodę POST)
    if (!name || !name[0] || request.method !== 'POST')
        return response.sendStatus(409);    // jeśli nie, odrzucamy ze statusem 409 Conflict, inne kody np. tutaj:
                                            // (https://pl.wikipedia.org/wiki/Kod_odpowiedzi_HTTP)

    // ustalamy ostateczną lokalizację pliku przez path.join.
	var temp=request.url.split(".");
	temp=temp[temp.length-1];
	temp=name[0]+"."+temp;
    const target = path.join(base, temp);
    console.log("Writing", target);

    // sprawdzamy, czy istnieje katalog do którego chcemy zapisać nasz plik.
    // !!! uznajemy, że nie musimy sprawdzać, czy to nie jest plik, ale jeśli byłoby to konieczne, wówczas użylibyśmy tu
    // metody fs.stat i w następnym kroku wykonali na zwróconym obiekcie metodę isDir.
    thenify(fs.access)(
        path.dirname(target)                                           // ustalamy katalog na podstawie ścieżki pliku
        //fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK       // określamy wymagane uprawnienia
    )
    .then(
        (ok) => 0,
                        // jeśli poprzedni Promise się rozwiązał, przechodzimy dalej (zwracamy dowolną wartość)
        (err) => thenify(fs.mkdir)(path.dirname(target))
                        // jeśli wystąpił błąd, usiłujemy utworzyć katalog
    )
    .then(
        () => fs.createWriteStream(target)      // jeśli wszystko poszło ok, otwieramy strumień do zapisu
    )
    .then(
	
        (wStream) => new Promise((resolve, reject) => {     // tworzymy nowy Promise
            request.setEncoding("binary")
                .on("error", reject)                        // ustalamy obsługę błędów dla żądania klienta
                .pipe(wStream)                              // przekierowujemy strumień od klienta do strumienia pliku
                                                          // zwacanym obiektem jest strumień docelowy, na którym możemy:
                    .on("error", reject)                        // wykonać obsługę błędów zapisu na dysk
                    .on("finish", resolve);                     // poczekać do końca zapisu i rozwiązać Promise
        })
    )
    .then(
        () => response.sendStatus(201)          // jeśli wszystko poszło ok, wysyłamy status do klienta
    )
    .catch(
        (e) => {
            console.error("error", e);          // jeśli nastąpił błąd gdziekolwiek wyżej - logujemy błąd
            response.sendStatus(500);           // i wysyłamy status błędu do klienta
                                                // (to konieczne, inaczej klient się nie rozłączy!)
        }
    )
    .catch(
                                                // jeśli nie udało nam się wysłać statusu, tutaj zakładamy, że klient
                                                // się rozłączył - choć nie jest to w pełni bezpieczne.
        () => console.log("probably client disconnected")
    );

	
	})

module.exports = router