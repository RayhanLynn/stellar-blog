---
title: 组合逻辑电路
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

>输出状态仅和当时的输入状态有关，而与过去的输入状态无关（无记忆）
# 逻辑门电路
>门电路：用以实现逻辑关系的电子电路
>基本门电路主要有：与门、或门、非门、与非门、或非门、异或门等

补充：数字电路中关于高低电平的概念
门电路中用高低电平表示不同的逻辑状态---表示的是一定的**电压范围**，不是一个固定值
$$
\begin{cases}
V_H & - \text{高电平} \quad 1 \\
V_L & - \text{低电平} \quad 0
\end{cases}

$$
## 门（电子开关）
开门状态：满足一定条件时，电路允许信号通过 → 开关接通
关门状态：条件不满足时，信号通不过 → 开关断开

### 分立元件门电路（了解即可）
#### 二极管
允许从高电压到低电压，只通过电流控制开关
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031190743.png)
- 二极管与门
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031191426.png)
- 二极管或门
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031191728.png)

#### 三极管
注：Vcc表示电路的正电源电压
三个电极：基极(Base)、集电极(Collector)、发射极(Emitter)

```image-layout-b
![](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031192233.png)
![](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031192538.png)

```
- 三极管的 E-C 极之间相当于一个**闭合的开关**，B 极是控制端
- 当基极（B）有足够的电流时，三极管进入饱和区，发射极（E）和集电极（C）之间 “导通”，电流可以从 E 流向 C

- 三极管与非门
$$F = \overline{AB}$$
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031193705.png" alt="image.png" style="max-width:296px;width:100%;height:auto;">
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031194626.png" alt="image.png" style="max-width:354px;width:100%;height:auto;">


- 三极管或非门
$$ F = \overline{A + B}$$
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031194149.png)
#### 缺点
- 体积大、工作不可靠
- 需要不同电源
- 各种门的输入、输出电平不匹配
与之相对应的是数字集成电路：
在**一块半导体基片上制作出一个完整的逻辑电路所需要的全部元件和连线**，称为数字集成电路
使用时接：电源、输入和输出。数字集成电路具有体积小、可靠性高、
速度快、而且价格便宜的特点

## 各种逻辑门符号
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031194922.png)

### 三态门
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251031200403.png)
左图：低电平使能
使能端 EN 有一个 “小圆圈”，表示**低电平有效**
右图：高电平使能
补充：EN是一个用于控制逻辑门或电路工作状态的输入信号---决定电路是否工作

# 🔆逻辑电路的设计方法（考）
已知---设计要求
待求---逻辑电路图
- 根据设计要求确定真值表
	- 确定变量【输入变量+输出变量】
- 根据真值表画卡诺图（推导逻辑表达式）
- 化简（求出最简化表达式）
- 按设计要求，变换逻辑表达式
	- 用哪些门电路--->变换成逻辑表达式
- 画出逻辑电路图
举例：
![e5b9ac9a9f35adb4a4fc6e63632c5d29.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/e5b9ac9a9f35adb4a4fc6e63632c5d29.jpg)

# 逻辑电路
- **组合逻辑电路**
	- 输出状态仅和当时的输入状态有关，而与过去输入状态无关
- 时序逻辑电路
	- 输出状态不仅和当时的输入状态有关，而且与过去输入状态有关
## 常用组合逻辑部件分析
## 加法器
### 半加器（Half Adder）
两个1位二进制相加，考虑向高位的进位，但不考虑从低位来的进位
![21e3cc7f53d22f51ba21b887139cf9a9.jpg](/assets/wiki-images/f8e22464e14599.jpg)
![Pasted image 20251020192217.png](/assets/wiki-images/13607506aed98d.png)

### 全加器（Full Adder）
两个1位二进制相加，既考虑低位来的进位，又考虑向高位的进位
![ed957a117fe100b6f395bf5c8f9d02a5.jpg](/assets/wiki-images/2bda036f48dffc.jpg)
![b868050e558de82f98c78571d7516a88.jpg](/assets/wiki-images/dd242f3d94f6c8.jpg)

## ✔️译码器
译码：把具有特定含义的二进制代码识别出来的过程
特点：多输入、多输出的组合逻辑电路

### 二进制译码器
定义：能将 n 个输入变量变换成 2^n 个输出函数，且输出函数与输入变量构成的最小项具有一一对应关系的一种多输出组合逻辑电路
![Pasted image 20251020193950.png](/assets/wiki-images/5eda675d770dec.png)
特点：
- 一般具有n个输入端、2^n个输出端和一个（或多个）使能输入端
- **使能输入端为有效电平时，对应每一组输入代码，仅一个输出端为有效电平**，其余输出端为无效电平
- 有效电平可以是高电平，也可以是低电平

#### 3-8线译码器
![Pasted image 20251020194759.png](/assets/wiki-images/ceba487d473ff0.png)
当译码器**使能有效**时，输入的 3 位二进制代码 A0、A1、A2会选中对应的输出端，使其输出**低电平**（选中的为0）；其余 7 个输出端保持**高电平**
逻辑功能示意图：
![0dd6bec37be65ec26328bf54f68a6919.jpg](/assets/wiki-images/11cd39f859fefb.jpg)

![Pasted image 20251020200100.png](/assets/wiki-images/a53cd22c1e4051.png)
注：74LS138低电平有效（有小圈圈对应低电平工作，反之高电平有效）

## 编码器（ENC不常用）
码制：采用多位数码，按一定规则表示不同事物信息的方法（编码+译码）
编码：用二进制表示文字、符号等信息的过程
定义：将特定含义的编码转换为二进制编码
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251101171848.png)

### 分类
- 普通编码器
	- 任何时刻只允许输入一个编码信号，否则输出将发生混乱，某一输入与它的编码输出是唯一对应关系
	- 多输入、多输出的组合逻辑电路
	- 多个输入端N，多个输出端n，位数由N=2^n决定
- 优先权编码器

## ✔️数据选择器（MUX）
>补充：
>数据传输方式
>1. 并行传送
>2. 串行传送
>数据选择器也称为数字多路器、多路开关、多路转换器

定义：从多路输入中选择一路送往输出端（从并行传送--->串行传送）
```image-layout-a
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251101172909.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251101172937.png)
```
- 选择哪一路输入传送到输出端由当时的选择输入信号决定
对于其工作原理的理解：
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251101173434.png)
理解：函数式相当于从0加到3（D---十进制、A---二进制）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251101173555.png)

## 数据分配器（DEMUX）（不常用）
>也成为多路分配器，是一路输入、多路输出的组合逻辑器件

定义：将一路输入信号选择送往多路输出之一
注：一路输入信号传送到哪一路输出端由当时的控制信号决定
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251101174402.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251101174818.png)
