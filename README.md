# ddc-fuzzy filters

Fuzzy matching filter for [ddc.vim](https://github.com/Shougo/ddc.vim)
The de facto standard filters, [match_head](https://github.com/Shougo/ddc-match_head) and [sorter_rank](https://github.com/Shougo/ddc-sorter_rank),
behave like the other completion such as VSCode.
They sugget terms containing an input as a substring, however, they ommit word with an typo,
it means that we cannot obtain a suggestion `word` from `wrd`, moreover, it is hard to select a long word with a short input.

Our filters fix this problem with the fuzzy filter hahaves like CtrlP.

To install our filters,

```vim
Plug 'tani/ddc-fuzzy'
```

To use our filters,

```vim
call ddc#custom#patch_global('sourceOptions', {
  \   '_': {
  \     'matchers': ['matcher_fuzzy'],
  \     'sorters': ['sorter_fuzzy'],
  \     'converters': ['converter_fuzzy']
  \   }
  \ })
```

This work is licensed under the MIT License.
Copyright &copy; 2021 TANIGUCHI Masaya. All rights reserved.
