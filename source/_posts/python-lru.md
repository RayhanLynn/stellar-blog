---
title: 用一个小例子，理解 LRU 缓存
date: '2026-09-13'
categories:
  - 代码实践
  - Python
tags:
  - Python
  - 缓存
description: 从“最近最少使用”出发，把一个缓存策略写成可读的代码。
banner: /assets/mountains.jpg
---

> 示例内容：用于检查主题排版，请替换为自己的文章。


## 从重复计算说起

同一个计算被反复调用时，保存结果可以减少重复工作。但是缓存空间有限，总要决定淘汰谁。

LRU 的策略是优先淘汰最近最久没有被访问的条目。

## 一个最小实现

下面借助 Python 的 OrderedDict 展示顺序如何变化。这是理解策略的示例，实际并发环境还需要考虑同步。

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self.capacity = capacity
        self.data = OrderedDict()

    def get(self, key):
        if key not in self.data:
            raise KeyError(key)
        self.data.move_to_end(key)
        return self.data[key]

    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)
```

## 观察访问顺序

写入一个已存在的键，也应让它成为最近使用的条目。读取一个键时，同样更新它的位置。

```python
cache = LRUCache(2)
cache.put("A", 1)
cache.put("B", 2)
cache.get("A")
cache.put("C", 3)
assert list(cache.data) == ["A", "C"]
```

此时 B 被淘汰，因为 A 刚刚被访问过。

## 实际使用时

对于函数调用结果缓存，可以先考虑标准库的 functools.lru_cache。自己实现策略时，还要考虑线程安全、过期时间和内存占用。

## 留下一个问题

如果程序不断扫描一大批只访问一次的数据，LRU 会发生什么？带着这个问题，可以继续比较其他淘汰策略。
