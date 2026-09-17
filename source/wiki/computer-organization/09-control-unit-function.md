---
title: 控制单元的功能
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

# 控制单元的外特性
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229142711.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
## 输入信号
1. 时钟
- 完成每个操作都需要占用一定时间
- 各个操作是有先后顺序的
CU受时钟控制
- [ ] 为了使控制单元**按一定的先后顺序、一定的节奏**发出各个控制信号，控制单元必须受时钟控制
- [ ] 每一个时钟脉冲使控制单元发送一个操作命令或发送一组需要同时执行的操作命令

2. 指令寄存器
现行指令的操作码决定了不同指令在执行周期所需完成的不同操作，指令的操作码字段是控制单元的输入信号，它与时钟配合可产生不同的控制信号
OP(IR) → CU(ID)

3. 标志
CU受标志位控制
控制单元有时需依赖CPU当前所处的状态（如ALU操作的结果）产生控制信号

4. 外来信号
来自系统总线（控制总线）的控制信号
INTR 中断请求
HRQ 总线请求

## 输出信号
1. CPU内部的各种信号
主要用于CPU内的寄存器之间的传送和控制ALU实现不同的操作
Ri → Rj
(PC)+1 → PC
ALU +、-、与、或

2. 送至系统总线（控制总线）的信号
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229144139.png" alt="image.png" style="max-width:304px;width:100%;height:auto;">

# 控制信号举例
控制单元的主要功能：发出各种不同的控制信号
数据通路：
数据在功能部件之间传送的路径，信息从哪里开始，中间经过哪些部件，最后传到哪里
由控制部件产生的控制信号建立数据通路

## CPU内部单总线方式🔆
>内部总线：同一个部件，如CPU内部连接各寄存器及运算部件之间的总线
>系统总线：同一台计算机系统的各部件互相连接的总线

以间接寻址的加法指令ADD @X 为例
取指周期
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229153405.png)

![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229153722.png)

间址周期
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229153839.png)
执行周期
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229154138.png)

另一个视角：
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229151219.png" alt="image.png" style="max-width:200px;width:100%;height:auto;">
1. 寄存器之间的数据传送
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229151813.png)

2. 主存与CPU之间的数据传送
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229152126.png)
3. 执行算术或逻辑运算
比如一条加法指令
![](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229152608.png)
特别注意：ALU的两个输入信号必须同时有效，而CPU内部总线同一时刻只能传送一个输入信号，因此不得不把其中一个操作数放到暂存寄存器Y中，Y与ALU的通路不会占用内部总线
**ALU配合暂存器使用**
常见考法：
![8397966ed0b49461fd7aaca108b231b8.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/8397966ed0b49461fd7aaca108b231b8.jpg)

## 不采用CPU内部总线方式
>专用通路结构
>连接多路选择器和三态门解决寄存器有多个可能的输入问题
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230100505.png)

取指周期---取指令送MDR-->IR
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230101046.png" alt="image.png" style="max-width:375px;width:100%;height:auto;">
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230101052.png" alt="image.png" style="max-width:375px;width:100%;height:auto;">
间址周期---取有效地址EA送MDR--->IR
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230101320.png)
执行周期---取操作数送MDR
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230101639.png)

典型例题：
明白原理+指令作用+学会看图说话
![2390dc5a555b86c1e8e292c060b0da45.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/2390dc5a555b86c1e8e292c060b0da45.jpg)


# 多级时序系统
## 前置知识
1. 机器周期
概念：可看作所有指令执行过程中的一个基准时间
>机器周期取决于指令的功能及器件的速度

确定机器周期需考虑的因素：
- 分析机器指令的执行步骤
- 每一步骤所需的时间

基准时间的确定
- 以完成最复杂指令功能的时间为准---对于简单指令来说是一种浪费
- 通常以访问一次存储器的时间为**基准**---机器周期
>机器内的各种操作大致归属为对CPU内部的操作和对主存的操作两大类，CPU内部的操作时间较快，CPU访存的时间较长

不论执行什么命令，都需要访问存储器取出指令，因此**在存储字长等于指令字长的前提下，取指周期可看作机器周期**

2. 时钟周期
>**节拍**、状态

一个机器周期内可完成若干个微操作，每个微操作需一定的时间，可用时钟信号来控制产生每一个微操作命令

时钟信号的频率即为CPU主频
用时钟信号控制节拍发生器，就可产生**节拍**，每个节拍的宽度正好对应一个时钟周期，在每个节拍内机器可完成一个或几个需同时执行的操作，**它是控制计算机操作的最小时间单位**

将一个机器周期分成若干个时间相等的时间段
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230125912.png)

## 多级时序系统
机器周期、节拍（状态）组成多级时序系统
- 一个指令周期包含若干机器周期
- 一个机器周期又包含若干个时钟周期（节拍）
每个指令周期内机器周期数可以不同，每个机器周期内的节拍数也可以不等
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230130445.png)

机器速度与机器主频的关系
- 一般来说，机器的主频 f 越快机器的速度也越快
- 在机器周期所含时钟周期数相同的前提下，两机平均指令执行速度之比等于两机主频之比
$$
\frac{MIPS_1}{MIPS_2}=\frac{f_1}{f_2}
$$
- 机器速度不仅与主频有关 ，还与机器周期中所含时钟周期（主频的倒数）数以及指令周期中所含的机器周期数有关
>机器周期所含时钟周期数少的机器，速度更块
- 主存运行速度、机器是否配有cache、总线数据传输率、硬盘的运行速度以及机器是否采用流水技术

# 控制方式
控制单元控制一条指令执行的过程实际上依次执行一个确定的微操作序列的过程
通常将如何形成控制不同微操作序列所采用的时序控制方式称为CU的控制方式

## 同步控制方式
定义：
任何一条指令或指令中的任何一个微操作的执行都是事先确定的，并且都是受统一基准时标的时序信号所控制
方案：
1. 采用定长的机器周期
不论指令所对应的微操作序列有多长，也不管微操作的繁简，**一律以最长的微操作序列和最繁的微操作作为标准**，采取完全统一的、具有相同时间间隔和**相同数目的节拍**作为机器周期来运行不同的指令
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230132746.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">

2. 采用不定长的机器周期
每个机器周期内的节拍数不同
通常把大多数微操作安排在一个较短的机器周期内完成，而对某些复杂的微操作，采用**延长机器周期或增加节拍的方法**解决
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230133002.png" alt="image.png" style="max-width:425px;width:100%;height:auto;">

3. 采用中央控制和局部控制相结合的方法
将机器的大部分指令安排在统一的、较短的机器周期内完成，称为**中央控制**
将少数操作复杂的指令中的某些操作采用**局部控制**方式来完成
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230133231.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
注意：
- 局部控制的节拍宽度与中央控制的节拍宽度一致
- 将局部控制节拍作为中央控制中机器节拍的延续，插入中央控制的执行周期内，使机器以同样的节奏工作，保证局部控制和中央控制同步

优缺点：
时序关系简单，时序划分规整，控制不复杂；控制逻辑易于集中，便于管理。时间安排不合理；时间利用不经济

## 异步控制方式
无基准时标信号，无固定的周期节拍和严格的时钟同步，采用应答方式
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230133725.png)
优缺点： 时间安排紧凑、合理；控制复杂

## 联合控制方式
同步控制方式和异步控制方式结合就是联合控制方式
大部分统一、小部分区别对待
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230133838.png)

## 人工控制方式
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230134033.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251230134041.png)
