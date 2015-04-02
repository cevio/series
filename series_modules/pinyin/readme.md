##require('pinyin')##

> var Word = require('pinyin')

中文转拼音

``` javascript
Word.pinyin('我'); // wo
Word.PINYIN('我'); // WO
Word.Pinyin('我'); // Wo
```

##SPM support##

> pinyin -n 我

全小写

> pinyin -u 我

全大写

> pinyin -c 我

开头字母大写