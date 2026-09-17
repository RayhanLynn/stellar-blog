---
title: 中断系统
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

# 概述
>为了提高计算机的效率，处理一些异常情况以及实时控制、多道程序和多处理机的需要，提出中断概念

1. 定义：程序中断是指在计算机执行现行程序的过程中，出现某些急需处理的异常情况给或特殊请求，CPU暂时中止现行程序，而转去对这些异常情况或特殊请求进行处理，而处理完毕后CPU又自动返回到现行程序的断点处，继续执行原程序

2. 引起中断的各种因素（中断源）
（1）因素
- 人为设置的中断
	- 如转（移到）管（理程序）指令【当用户程序执行转管指令后，便中断现行程序，转入管理程序，这种转移完全自愿】<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228195045.png" alt="image.png" style="max-width:110px;width:100%;height:auto;">
>自愿中断，一旦执行这种人为中断，便自愿停止现行程序而转入中断处理
- 程序性事故
	- 溢出、操作码不能识别、除法非法、访存越权或越界
- 硬件故障
- I/O设备
- 外部事件
	- 如用键盘中断现行程序

（2）中断源的分类
- 可屏蔽中断
	- CPU根据中断源是否被屏蔽确定是否给予响应
- 不可屏蔽中断
	- 这类中断CPU不能禁止响应，如电源断电

3. 工作流程
- 中断请求
	- 中断源向CPU发送中断请求信号
- 中断响应
	- 响应中断的条件--是否处于关中断的状态
	- 中断判优：多个中断源同时提出请求时通过**中断判优逻辑**【优先级】响应一个中断源
- 中断处理
	- 中断隐指令---本质：修改PC的值
	- 中断服务程序

4. 中断系统需要解决的问题
- 各中断源如何向CPU提出中断请求
- 当多个中断源同时提出中断请求时，中断系统如何确定优先响应哪个中断源的请求
- CPU在什么条件、什么时候、以什么方式来响应中断
- CPU响应中断后如何保护现场
- CPU响应中断后，如何停止原程序的执行而转入中断服务程序的入口地址
- 中断处理结束后，CPU如何恢复现场，如何返回到原程序的间断处
- 在中断处理过程中又出现了新的中断请求，CPU该如何处理

# 中断请求标记和中断判优逻辑
## 中断请求标记
>解决如何判断哪个设备发来的中断信号

为了判断是哪个中断源提出请求，在中断系统中必须设置**中断请求标记触发器**，简称中断请求触发器，记作INTR
- 当其状态为1时，表示中断源有请求
- 一个请求源 一个 INTR中断请求标记触发器
- 多个 INTR  可集中设在CPU内，组成中断请求标记寄存器
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228201206.png)
- 尽管中断请求标记寄存器是由各中断请求触发器组成的，但这些触发器既可以集中在CPU的中断系统中，也可以分散到各个中断源中
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228201503.png)

## 中断判优逻辑
>解决有多个中断信号同时到来，先处理哪个

中断判优：任何一个中断系统，在任一时刻，只能响应一个中断源的请求，**当某一时刻多个中断源提出中断请求时，中断系统必须按照其优先顺序予以响应**
>各中断源的优先顺序是根据该中断源若得不到及时响应，致使机器工作出错的严重程度决定的

形式：
中断判优既可以用硬件实现，也可以用软件实现
- 硬件排队
	- 链式排队器，对应中断请求触发器分散在各个接口电路中的情况
	- 集中在CPU内的排队器
		- 当最高优先级的中断源有请求INTR1=1，就可以封住比它优先级低的中断源的请求<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228202625.png" alt="image.png" style="max-width:425px;width:100%;height:auto;">
- 软件排队
软件排队是通过编写**查询程序**实现的
思想：程序按中断源的优先等级从高到低逐级查询各中断源是否有中断请求，以保证CPU首先响应级别高的中断源的请求
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228203153.png" alt="image.png" style="max-width:250px;width:100%;height:auto;">
优先级设置
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228203436.png" alt="image.png" style="max-width:400px;width:100%;height:auto;">

# 中断响应
## 响应条件与响应中断的时间
1. 响应条件
- 允许中断触发器EINT=1
- 有中断请求
- 指令执行结束

2. 响应中断的时间
指令执行周期结束时由 CPU 发查询信号
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228211312.png" alt="image.png" style="max-width:450px;width:100%;height:auto;">


# 中断处理过程
## 中断隐指令
**保护断点、寻找入口地址和关中断这些操作都是在中断周期内由一条中断隐指令完成的【一系列任务】，所谓中断隐指令即在机器指令系统中没有的指令，它是CPU在中断周期内由硬件自动完成的一条指令**

CPU响应中断后，即进入中断周期，在中断周期内，CPU会自动完成以下一系列操作---中断隐指令的主要任务：
- 关中断
在中断服务程序中，为了保护中断现场（即CPU主要寄存器中的内容）期间不被新的中断所打断，必须关中断，从而**保证被中断的程序在中断服务程序执行完毕后能接着正确执行下去**
>为了**确保CPU响应后所做的一系列操作不至于又受到新的中断请求的干扰**，在中断周期内必须自动关中断，以禁止CPU再次响应新的中断请求
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228212836.png" alt="image.png" style="max-width:225px;width:100%;height:auto;">

- 保护程序断点
为了保证在中断服务程序执行完毕后能正确返回到原来的程序，必须将原来程序的断点（PC的内容）保存起来
保护程序断点就是将当前程序计数器PC的内容保存在存储器中，可以保存在存储器的特定单元，也可存入堆栈
- 寻找中断服务程序的入口地址
	- 在中断周期内，将向量地址送至PC（对应硬件向量法）使CPU执行下一条无条件转移指令，转至中断服务程序的入口地址
	- 将软件查询入口地址的程序（中断识别程序）的首地址送至PC，使CPU执行中断识别程序，找到入口地址
引出中断服务程序的实质是**取出中断服务程序的入口地址并传送给程序计数器PC**

### 中断服务程序入口地址的寻找
进入中断服务程序的方法：把**该程序第一条指令的地址放入PC**
回到主程序的方法：把K+1放入PC
#### 硬件向量法
定义：**利用硬件产生向量地址，再由向量地址找到中断服务程序的入口地址**
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228205926.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
硬件相量法寻找入口地址快，在现代计算机中被普遍采用

#### 软件查询法
定义：当查到某一中断源有中断请求时，接着安排一条转移指令，直接指向此中断源的中断服务程序入口地址，机器便能自动进入中断处理

## 中断服务程序
主要任务
- 保护现场
	- 保护程序断点现场---**中断隐指令**
	- 保护CPU内部各寄存器内容现场 --- 各寄存器内的现场可在**中断服务程序**中由用户（或系统）用机器指令编程完成
>以便返回原程序后可以恢复CPU环境
- 中断服务（设备服务）
- 恢复现场
	- 在中断返回前，将寄存器中的内容恢复到中断处理前的状态
- 中断返回
	- 通过中断返回指令回到原程序断点处

# 中断屏蔽技术
中断屏蔽技术主要用于多重中断
## 多重中断
1. 概念
单重中断：CPU对新的中断请求不予响应，待执行完当前的服务程序后再响应
多重中断：当CPU正在执行某个中断服务程序，另一个中断源又提出了新的中断请求，而CPU又响应了这个新的请求，暂时停止正在运行的服务程序，转去执行新的中断服务程序
>中断嵌套，执行中断服务程序时可响应新的中断请求

2. 实现多重中断条件
	1. 在中断服务程序中提前设置开中断指令
		- 多重中断“开中断”指令前于执行单重中断，从而保证多重中断允许出现中断嵌套
	2. 优先级高的中断源有权中断优先级低的中断源<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229100502.png" alt="image.png" style="max-width:500px;width:100%;height:auto;">

<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229095756.png" alt="image.png" style="max-width:425px;width:100%;height:auto;">

## 屏蔽技术
>为了保证级别低的中断源不干扰比其级别高的中断源的中断处理过程，可采用屏蔽技术

### 屏蔽触发器与屏蔽字
1. 屏蔽触发器：
如果排队器集中设在CPU内，加上屏蔽条件，就可组成具有屏蔽功能的排队器
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229101251.png)
对应每个中断请求触发器就有一个屏蔽触发器，将所有屏蔽触发器组合在一起，便构成了一个屏蔽寄存器，**屏蔽寄存器的内容称为屏蔽字**，**屏蔽字与优先级别一一对应**
2. 屏蔽字设置的规律：
- 一般用‘1’表示屏蔽，‘0’表示正常申请
- 每个中断源对应一个屏蔽字且每个中断源对应的屏蔽字不同（在处理该中断源的中断服务程序中，屏蔽寄存器中的内容为该中断源对应的屏蔽字）
- 屏蔽字‘1’越多，优先级越高，每个屏蔽字中至少有一个‘1’（至少能屏蔽自身的中断）

3. 屏蔽技术可改变处理**优先等级**🔆
优先级
- 响应优先级
	- 响应优先级是指CPU响应各中断源请求的优先次序，这种次序往往是硬件线路已经设置好的，**不便于改动**（链式排队器）
- 处理优先级
	- CPU实际对各中断源请求的处理优先次序（通过重新设置屏蔽器改变
举例：
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229103102.png)
将上述4个中断源的处理顺序改为A->D->C->B，则每个中断源对应的屏蔽字发生了变化
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229103219.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229103241.png)
分析上述轨迹：
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229103432.png" alt="image.png" style="max-width:400px;width:100%;height:auto;">

4. 常考题型举例
- 设置中断屏蔽字-动态改变中断优先级（会根据屏蔽字判断优先级和已知优先级写屏蔽字）
- 描绘CPU的运行轨迹
![65eaebe538a326c5b057c9daf0aff241.jpg](https://picgorh.oss-cn-beijing.aliyuncs.com/image/65eaebe538a326c5b057c9daf0aff241.jpg)
5. 多重中断的断点保护
多重中断时，每次中断出现的断点都必须保存起来，中断系统对断点的保存都是在中断周期内由中断隐指令完成
- 断点保存在堆栈中
- 断点保存在特定的存储单元
	- eg:一律将断点存入0地址单元
		- 在中断服务程序中的开中断指令前，必须将0地址单元的内容转存至其他地址单元中，才能真正保存每一个断点


# 总结
单重中断：执行中断服务程序时不响应新的中断请求
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251228214537.png" alt="image.png" style="max-width:164px;width:100%;height:auto;">
采用屏蔽技术的中断服务程序
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229105558.png" alt="image.png" style="max-width:400px;width:100%;height:auto;">


<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251229105101.png" alt="image.png" style="max-width:475px;width:100%;height:auto;">
