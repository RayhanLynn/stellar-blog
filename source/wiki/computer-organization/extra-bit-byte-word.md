---
title: 比特、字节与字
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

比特（bit，简写为 b）
- 定义：计算机中**最小的数据单位**，表示一个二进制数位，只有两种状态：0 或 1（对应电路的通 / 断、电平的高 / 低）

字节（Byte，简写为 B）
- 定义：计算机中**基本的存储和处理单位**，国际标准规定：`1 Byte = 8 bits`（8 个连续的比特组成 1 个字节）。
- 核心换算：`1B = 8b`（注意区分大小写：b 是比特，B 是字节，日常说的 “100M 宽带” 实际是 100Mb/s，换算成字节是 12.5MB/s）

 处理器处理单位：字（Word）
- 定义：CPU**一次能并行处理的二进制数据长度**（即 “字长”），由 CPU 架构决定，不是固定值
