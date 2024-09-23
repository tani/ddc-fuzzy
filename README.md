# ddc-fuzzy filters

## Introduction

https://user-images.githubusercontent.com/5019902/136666268-0953a435-f331-48e6-9502-490d40b55693.mp4

Fuzzy matching filters for [ddc.vim](https://github.com/Shougo/ddc.vim).

The de facto standard filters,
[match_head](https://github.com/Shougo/ddc-match_head) and
[sorter_rank](https://github.com/Shougo/ddc-sorter_rank), behave like the other
completion such as VSCode. They suggest terms containing an input as a
substring. However, they omit words with a typo. It means that we cannot obtain
a suggestion word from wrd. Moreover, it is hard to select a long word with a
short input.

Our filters fix this problem with the fuzzy filter that behaves like CtrlP.

## Installation

To install our filters,

```viml
Plug 'tani/ddc-fuzzy'
```

To use our filters,

```viml
call ddc#custom#patch_global('ui', 'pum')
call ddc#custom#patch_global('sourceOptions', {
  \   '_': {
  \     'matchers': ['matcher_fuzzy'],
  \     'sorters': ['sorter_fuzzy'],
  \     'converters': ['converter_fuzzy']
  \   }
  \ })
```

## Configuration

`matcher_fuzzy` filter provides an option `splitMode`. For the default mode,
`{ 'splitMode': 'character' }`, each input character matches any characters of a
candidate. For example, `abc` matches `axbxc`. On the other hand, for the option
`{'splitMode': 'word'}`, each input character matches the beginning of a word of
a candidate. For example, `abc` does not match `axbxc` but `abc` matches `a_bc`
and `a_b_c`.

```viml
call ddc#custom#patch_global('filterParams', {
  \   'matcher_fuzzy': {
  \     'splitMode': 'word'
  \   }
  \ })
```

`converter_fuzzy` filter provides an option `hlGroup` to change the highlight
group in vim. This filter applies the highlight group to characters matched by
the input pattern.

```viml
call ddc#custom#patch_global('filterParams', {
  \   'converter_fuzzy': {
  \     'hlGroup': 'SpellBad'
  \   }
  \ })
```

## Related Projects

- [tani/ddc-git](https://github.com/tani/ddc-git), git commit/file/branch completion
- [tani/ddc-oldfiles](https://github.com/tani/ddc-oldfiles), oldfiles completion
- [tani/ddc-path](https://github.com/tani/ddc-path), path namescompletion in current working directory
- [tani/ddc-onp](https://github.com/tani/ddc-onp), yet another fuzzy matcher with O(NP) algorithm

This work is licensed under the MIT License. Copyright &copy; 2021 TANIGUCHI
Masaya. All rights reserved.
