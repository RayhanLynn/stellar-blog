---
title: 指令周期和指令流水
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

# 指令周期
## 基本概念
1. 指令周期：CPU从主存中每取出并执行一条指令所需的全部时间/CPU完成一条指令的时间
完成一条指令
- 取指周期：取指令+分析指令（比起取指令访存速度很快）
- 执行周期：执行指令
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226144854.png" alt="image.png" style="max-width:200px;width:100%;height:auto;">
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226145002.png" alt="image.png" style="max-width:325px;width:100%;height:auto;">
2. 补充：
- **指令周期**常常用若干机器周期<完成一个子工作>来表示，**机器周期**又叫CPU周期
- 一个机器周期又包含若干**时钟周期**（**节拍**、T周期、CPU时钟周期），它是CPU操作的最基本单位
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226145507.png)
有可能出现执行指令比取指令所需的CPU的节拍数更少
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226145603.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
*每个指令周期内机器周期数可以不等，每个机器周期内的节拍数也可以不等*---由于各种指令操作功能不同，因此各种指令的指令周期不相同的
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226150410.png)
3. 具有间接寻址的指令周期
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226151119.png)
间接寻址的指令周期：
- 取指周期
- 间址周期：**取操作数的有效地址**
- 执行周期
 
 4. 带有中断周期的指令周期
在执行快结束阶段，留出一部分中断周期检查是否有中断信号需要处理【许多指令在CPU每条指令执行阶段结束前，都要发出中断查询信号，以检测是否有中断请求需要处理，如果有请求，CPU进入中断响应阶段，又称为中断周期】
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226152022.png" alt="image.png" style="max-width:400px;width:100%;height:auto;">

5. 指令周期流程
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226152212.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
上述四个周期【**CPU的工作周期**】都有CPU的访存操作，只是访存的目的不同：
取指周期：取指令
间址周期：取有效地址
执行周期：取操作数（当指令为访存指令时）
中断周期：保存程序断点

为了区分它们，可在CPU内设置4个标志触发器---CPU工作周期标志触发器
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226152722.png)

## 数据流
为了便于分析指令周期中的数据流，假设CPU中有存储器地址寄存器MAR、存储器数据寄存器MDR、程序计数器PC、指令寄存器IR
1. 取指周期的数据流
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226153655.png)
- PC存放现行指令的地址，该地址送到MAR并送至地址总线（PC）-> MAR
- 控制部件CU向存储器发出读命令 1->R
- 将对应MAR所指单元中的内容（指令）经数据总线送至MDR M(MAR)->MDR
- 将MDR中的内容（指令）送至IR （MDR)->IR
- CU发出控制信号，形成下一条指令地址 (PC)+1->PC

2. 间址周期的数据流
最终有效地址的两种处理方式：
- 从MDR直接送给MAR
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226164847.png)
- 将有效地址送至指令的地址码字段
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251226165101.png)
前三步的梳理：
一旦取指周期结束，CU便会检查IR中的内容，以确定其是否有间址操作，若有间址操作：
- 将指令的地址码送入MAR，又送至地址总线
Ad(IR)->MAR
Ad(MDR)->MAR
此时IR和MDR存储同一指令
- CU向存储器发读命令 1->R
- 将MAR所指主存中的内容经数据总线送入MDR
M(MAR)->MDR

3. 执行周期的数据流
执行周期的任务是根据IR中指令字的操作码和操作数通过ALU操作/CPU内部寄存器间的数据传送/对存储器(或I/O)进行读写操作产生执行结果
不同的指令在执行周期的操作不同，无法用统一的数据流图表示

4. 中断周期
>中断：暂停当前任务/程序去完成其他任务程序
>为了能够恢复当前任务，需要保存断点
>（PC）当前的内容必须保存起来，以待执行完中断服务程序后可以准确返回到该程序的间断处

在每一个进程运行过程当中，操作系统都会给进程在主存中开辟一片空间作为进程的运行堆栈，一般使用堆栈来保存断点，SP表示栈顶地址，指向栈顶元素，进栈操作先修改指针，后存入数据

- CU控制将SP-1，修改后的地址送入MAR
(SP)-1->SP (SP)->MAR
本质上是将断点存入某个存储单元，假设其地址为a，故可记作a->MAR
- CU发出控制信号，启动主存做写操作 1->w
- 将断点（PC内容）送入MDR
(PC)->MDR
- CU控制将中断服务程序的入口地址（由向量地址形成部件产生）送入PC
向量地址->PC
![f850524e8e9e4d84e16af08a48e943f8.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/f850524e8e9e4d84e16af08a48e943f8.jpg)


# 指令流水
>对指令的执行过程进行优化

## 如何提高机器速度
- 提高访存速度
	- 提高存储芯片的性能---高速芯片
	- 分级存储措施提高存储器的性能/价格比
		- cache
		- 多体
- 提高主机与I/O交换信息的速度
	- DMA方式
	- 多总线结构，将速度不一的I/O分别挂到不同带宽的总线上
- 提高运算器速度
	- 高速芯片
	- 快速进位链
	- 改进算法
- 提高整机的速度
	- 提高器件的性能---高速器件
	- 改进系统结构，开发系统的并行性
		- 并行的概念
			- 同时性：两个或多个事件在**同一时刻**发生
			- 并发性：两个或多个事件在**同一时间段**发生
			- 同一时刻或同一时间段完成两种或两种以上性质相同或不同的功能，只要在时间上相互重叠，存在并行性
		- 并行性的等级
			- 过程级 粗粒度 算法（软件）实现
				- 作业级/程序级
				- 任务级/进程级
			- 指令级 细粒度 硬件实现
				- 指令之间
				- 指令内部

## 原理
一条指令的执行过程可以分成多个阶段
取指 分析 执行
**取指**：根据PC内容访问主存储器，取出一条指令送到IR
**分析**：对指令操作码进行译码，按照给定的寻址方式和地址字段中的内容形成操作数的有效地址EA，并从有效地址EA取出操作数
**执行**：根据操作码字段，完成指令规定的功能，把运算结果写到通用寄存器/主存中
*特点：每个阶段有可能用到的硬件不同*

1. 指令的串行执行
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228140117.png)

传统的冯·诺伊曼机采用顺序执行方式/串行执行方式
优点：**控制简单**，硬件代价小
缺点：执行指令的速度较慢，任何时刻处理机只有一条指令在执行，**各功能部件的利用率低**

2. 指令的二级流水
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228140902.png)
指令预取：由指令部件取出一条指令，并将它暂存起来，如果执行部件空闲，就将暂存的指令传给执行部件执行，与此同时，指令部件又可取出下一条指令并暂存起来
影响指令流水效率加倍的因素：
- 一般执行时间 > 取指时间![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228141236.png)
- 条件转移指令对指令流水的影响
	- 当遇到条件转移指令时，下一条指令是不可知的，必须等执行阶段结束后，才能获知条件是否成立，从而决定下条指令的地址，造成时间损失
	- 解决方案：猜测法
		- 当条件转移指令从取指阶段进入执行阶段时，指令部件仍按顺序预取下一条指令
			- 若条件不成立，转移未发生，则没有时间损失
			- 若条件成立，转移发生，则所取的指令必须丢掉，并再取新的指令
3.指令六级流水时序
在这个流水线中，处理器有六个操作部件，同时对六条指令进行加工，加快程序的执行速度
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228142346.png)

![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228142246.png)

## 流水线的表示方法
- 指令执行过程图![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228142738.png)
- 时空图![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228142752.png)
	- 每个执行阶段默认所需时间相同
	- 各个阶段所需硬件相互独立，不同的阶段对应不同的硬件资源
	- 用途：分析流水线的性能

## 流水线的性能指标
假设理想情况：每个阶段**花费时间相同**，且每个阶段结束后能立即进入下一阶段
1. 吞吐率
定义：在指令级流水线中，吞吐率指单位时间内流水线所完成指令或输出结果的数量
- 最大吞吐率
	- 流水线在连续流动达到稳定的状态所获得的吞吐率$$T_{pmax}=\frac{1}{\Delta t}$$![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228145125.png)
	- 流水线仅在连续流动时才可达到最大吞吐率
	- 实际上由于流水线在开始时有一段建立时间（第一条指令输入后到其完成的时间），结束时有一段排空时间（最后一条指令输入后到其完成的时间），以及由于各种相关因素使流水线无法连续流动，因此，实际吞吐率总是小于最大吞吐率
- 实际吞吐率
	- 流水线完成n条指令的实际吞吐率![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228144842.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228145220.png)
2. 加速比
定义：完成同样一批任务，不适用流水线所用的时间与使用流水线所用的时间之比
（m 段的流水线速度与等功能的非流水线的速度之比）
$$
S_{p}=\frac{nm\Delta t}{m\Delta t+(n-1)\Delta t}=\frac{nm}{m+n-1}
$$
当n>>m时，Sp接近于m，**当流水线各段时间相等，其最大加速比等于流水线的段数**
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228145746.png)

3. 效率
定义：流水线中各功能段的利用率
>利用率：设备忙碌的时间占总时间的比率
>通常用流水线各段处于工作时间的时空区与流水线各段总的时空区之比衡量流水线的效率

$$E=\frac{mn\Delta t}{m(m+n-1)\Delta t}=\frac{n}{m+n-1}$$
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228151323.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228151645.png)

## 影响流水线性能的因素
为了方便讨论，假设流水线由5段组成，分别是取指令(IF)、指令译码/读寄存器(ID)、执行/访存有效地址计算(EX)、存储器访问(MEM)、结果写回寄存器(WB)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228161848.png)
- IF阶段：根据PC指向的位置去Instruction Cache里找出当前要执行的指令，把取出的指令放到功能段的锁存器中
- MEM阶段：Data Cache大部分情况下可以从cache里直接命中想要的数据
>CPU内cache分成两个独立的模块，一种专门用来存储指令的，另一种专门用来存储变量和数据，意味着对这两个模块可以并行工作
- ID阶段：译码+取数，从通用寄存器取出当前指令所需要用到的操作数
- EX阶段：用ALU处理前一个阶段取出的操作数，将运算结果放入锁存器
- WB阶段：将计算的结果写回到某一通用寄存器中

### 结构相关
定义：当指令在重叠过程中，不同指令争用同一功能部件产生资源冲突时产生的---资源相关
>当多条指令进入流水线后，硬件资源满足不了指令重叠执行的要求产生的

解决冲突的方法：
- 后一相关指令暂停一个周期
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228165020.png)
- 资源重复配置：数据存储器+指令存储器
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228165055.png)
- 指令预取技术

### 数据相关
定义：在一个程序中，存在必须等前一条指令执行完才能执行后一条指令的情况
>指令在流水线中重叠执行时，当后续指令需要用到前面指令的执行结果时发生的
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228183702.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228183726.png)

解决方案：
- 把遇到数据相关的指令及其后续指令都暂停一至几个时钟周期，直至数据相关问题消失后再继续执行
（直至前面指令的结果已经生成）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228184045.png)
- 采用定向技术
>又称为旁路技术、相关专用通路技术

主要思想：不必待某条指令的执行结果送回到寄存器后，再从寄存器中取出该结果，作为下一条指令的源操作，而是直接将执行结果送到其他指令所需要的地方
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228184800.png)
在第一条指令结果出来后连出旁路直接送往ALU的其中一个数据端，作为下一条指令的输入
- 编译优化：通过编译器调整指令顺序来解决数据相关

### 控制相关
定义：当流水线遇到分支指令/转移指令和其他改变PC值的指令而造成断流时，会引起控制相关
>控制相关主要是由转移指令引起的
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228190139.png)

解决方案：
- 尽早判断转移是否发生，尽早生成转移目标指令
- 预取转移成功和转移不成功两个控制流方向上的目标指令
- 加快和提前形成条件码
- 提高转移方向的猜测率

## 流水线的多发技术
定义：在一个时钟周期内产生更多条指令的结果
假设处理一条指令分为4个阶段
取指(IF)、译码(ID)、执行(EX)、写回(WR)
## 超标量技术
定义：在每个时钟周期内**可同时并发多条独立指令**，即以并行操作方式将两条或两条以上的指令编译并执行
实现超标量技术，要求处理机中配置多个功能部件和指令译码电路，以及多个寄存器端口和总线，以便实现同时执行多个操作
**不能调整指令的执行顺序**
通过编译优化技术，把可并行执行的指令搭配起来
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228191121.png)
## 超流水线技术
定义：将一些流水线寄存器插入流水线段中，好比将流水线再分段
- 在一个时钟周期内一个功能部件使用多次
- 不能调整指令的执行顺序，靠编译程序解决优化问题
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228191550.png)
上述多发技术使得流水速度是原来的3倍

## 超长指令字技术
由编译程序挖掘出指令间潜在的并行性
将多条能并行操作的指令组合成一条具有多个操作码（和更多个地址码）字段的超长指令字
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228191856.png)

## 流水线结构
1. 指令流水线
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228192216.png)

2. 运算流水线
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228192343.png" alt="image.png" style="max-width:275px;width:100%;height:auto;">
