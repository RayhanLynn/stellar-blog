---
title: 输入输出系统
layout: page
wiki: computer-organization
menu_id: wiki
banner: /assets/snow-mountain-lake.jpg
---

# 概述
## 发展概况
1. 早期阶段
早期I/O设备种类较少，I/O设备与主存交换信息都必须通过CPU
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231202818.png)
I/O设备的特点：
- 每个I/O设备都必须配有一套独立的逻辑电路与CPU相连，用来实现I/O设备与主机之间的信息交换，线路十分散乱、庞杂
- CPU 和 I/O 设备串行工作，浪费时间
- 增添、撤减或更换I/O设备非常困难
2. 接口模块和DMA阶段
I/O设备通过接口模块与主机连接，计算机系统采用了总线结构
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231203523.png" alt="image.png" style="max-width:300px;width:100%;height:auto;">
CPU和I/O设备可按并行方式工作，大大提高了CPU的工作效率
- 中断方式
- DMA方式

3. 具有通道结构的阶段
4. 具有 I/O 处理机的阶段

## 输入输出系统的组成
输入输出系统由I/O软件和I/O硬件两部分组成
### I/O软件
1. I/O指令
I/O指令是机器指令的一类，I/O指令应该能反映CPU与I/O设备交换信息的各种特点
I/O指令是CPU指令系统的一部分
- 反映对多台I/O设备的选择
- 在完成信息交换的过程中，对不同设备应该做哪些具体操作等
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231204755.png" alt="image.png" style="max-width:222px;width:100%;height:auto;">
操作码字段：与其他指令的判别代码
命令码：体现I/O设备的具体操作
- 将数据从I/O设备输入主机
- 将数据从主机输入至I/O设备
- 状态测试
- 形成某些操作命令
设备码：多台I/O设备的选择码
- 相当于设备的地址，只有对繁多的I/O设备赋以不同的编号，才能准确选择某台设备与主机交换信息

2. 通道指令
对具有通道的I/O系统专门设置的指令
**通道自身的指令**
指明内容：
- 指明参与传送的数据组在主存中的首地址
- 需要传送的字节数或传送数据组的末地址
- 指明所选设备的设备码及完成某种操作的命令码

### I/O硬件
带有接口的I/O系统：一般包含**接口模板+I/O设备**
具有通道的I/O系统：一个通道可以和一个以上的设备控制器相连，一个设备控制器又可以控制若干台同一类型的设备

## I/O设备和主机的联系方式
### I/O设备编址方式
通常将I/O设备码看作地址码
对I/O设备的编址采用两种方式：
- 统一编址：I/O地址看作存储器地址的一部分
$$
\begin{cases}
0000H-07FFH: \text{IO 设备地址}\\
0800H-FFFFH:\text{内存地址}
\end{cases}
$$
- 不统一编址
	- I/O地址和存储器地址是分开的，所有对I/O设备的访问必须有专门的I/O指令

### 设备寻址
当要启动某一设备时，可由I/O指令的设备码字段直接指出该设备的设备号，通过接口电路中的设备选择电路，便可选中要交换信息的设备

### 传送方式
- 并行传送<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231211930.png" alt="image.png" style="max-width:164px;width:100%;height:auto;">
	- 在同一瞬间，n位信息同时从CPU输出至I/O设备，或由I/O设备输入CPU
	- 特点：传送速度较快，但要求数据线多
- 串行传送<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231211912.png" alt="image.png" style="max-width:193px;width:100%;height:auto;">
	- 在同一瞬间只传送一位信息，在不同时刻连续逐位传送一串信息
	- 特点：传送速度较慢，但只需一根数据线和一根地线
	- 当I/O设备与主机距离很远时，采用串行传送较为合理

### 联络方式
- 立即响应方式
	- 对于一些工作速度十分缓慢的I/O设备，当它们与CPU发生联系时，通常都以使其处于某种等待状态，只要CPU的I/O指令一到，它们便立即响应
- 异步工作采用应答信号方式
	- 当I/O设备与主机工作速度不匹配时，通常采用异步工作方式![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231212822.png)
	- 具体执行过程![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231212742.png)
- 同步工作采用同步时标联络
	- I/O设备与CPU的工作速度必须完全同步
	- 这种联络互相之间还得配有专用电路，用以产生同步时标来控制同步工作

### I/O设备与主机的连接方式
- 辐射式<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231213146.png" alt="image.png" style="max-width:154px;width:100%;height:auto;">
	- 每台设备都配有一套控制线路和一组信号线
	- 不便于增删设备
- 总线式<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231203523.png" alt="image.png" style="max-width:300px;width:100%;height:auto;">
	- 通过一组总线（包括地址线、数据线、控制线等）将所有的I/O设备与主机连接
	- 扩展方便，便于增删设备

## I/O设备与主机信息传送的控制方式
### 程序查询方式
思想：由CPU**通过程序不断查询I/O设备是否已经做好准备**，从而控制I/O设备与主机交换信息

要求I/O接口内设置一个能反映I/O设备是否准备就绪的**状态标记**，CPU通过对此标记的检测，可得知I/O设备的准备情况
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231213905.png" alt="image.png" style="max-width:250px;width:100%;height:auto;">
特点：
- 只要一启动I/O设备，CPU便不断查询I/O设备的准备情况，从而**终止原程序的执行**，CPU在反复查询过程中，犹如原地踏步，**效率不高**
- I/O设备准备就绪后，CPU要一个字一个字地从I/O设备取出，经CPU送至主存，CPU和I/O设备处于**串行工作状态**

### 程序中断方式
思想：CPU在启动I/O设备后，**不查询设备是否已准备就绪**，继续执行自身程序，只是当I/O设备准备就绪并向CPU发出中断请求后才予以响应
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231214651.png" alt="image.png" style="max-width:225px;width:100%;height:auto;">
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20251231214836.png" alt="image.png" style="max-width:250px;width:100%;height:auto;">
特点：
- 程序中断方式在I/O设备进行准备时，CPU不必时刻查询I/O设备的准备情况，不出现踏步现象
- CPU执行程序与I/O设备做准备是同时进行的

### DMA方式
>Direct Memory Access

思想：
- 主存和 I/O 之间有一条直接数据通道
- 主存与I/O设备交换信息时，无需调用中断服务程序
- 若出现DMA和CPU同时访问主存，CPU总是将总线占有权让给DMA，通常把DMA的这种占有称为窃取或挪用
	- 窃取的时间一般为一个存取周期
- 在DMA窃取存取周期时，CPU尚能继续做内部操作
- CPU和I/O并行工作
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260101162407.png" alt="image.png" style="max-width:400px;width:100%;height:auto;">

### 总结
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260101162538.png" alt="image.png" style="max-width:500px;width:100%;height:auto;">

# I/O接口
>又称I/O控制器、设备控制器，负责协调主机与外部设备之间的数据传输，实现主机-I/O接口-I/O设备之间的通信
## 设置接口原因
>I/O接口通常是指主机与I/O设备之间设置的一个硬件电路及其相应的软件控制

1. 实现设备的选择
2. 实现数据缓冲达到速度匹配
3. 有些I/O设备可能通过串行传送数据，而CPU一般为并行传送，通过接口可实现数据串-并格式的转化
4.  实现电平转换
5. CPU启动I/O设备工作，要向I/O设备发各种控制信号，通过接口可传送控制命令
6. I/O设备需要将其工作状态（“忙”“就绪”“错误”“中断请求”等）及时向CPU报告，通过接口可监视设备的工作状态，并可保存状态信息，供CPU查询

## 接口的功能和组成
### 总线连接方式的I/O接口电路
每一台I/O设备通过I/O接口挂到系统总线上的
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260101174251.png" alt="image.png" style="max-width:275px;width:100%;height:auto;">
上图中I/O总线包括以下几个部分：
- 数据线
	- I/O设备与主机之间数据代码的传送线
	- 根数一般等于存储字长的位数或字符的位数
- 设备选择线
	- 用来传送设备码的
	- 其根数取决于I/O指令中设备码的位数
	- 若把设备码看作地址号，那么设备选择线又称为地址线
- 命令线
	- 主要用以传输CPU向设备发出的各种命令信号
	- 其根数与命令信号有关
- 状态线
	- 将I/O设备的状态向主机报告的信号线

### 功能与组成
1. 选址功能
CPU究竟选择哪台设备，通过设备选择线上的设备码确定，将该设备码送至所有设备的接口，要求每个接口都必须具有选址功能，即**当设备选择线上的设备码与本设备码相符时，应发出设备选中信号**SEL
组成：
通过接口内的**设备选择电路**来实现
2. 传送命令功能
当CPU向I/O设备发出命令时，要求I/O设备能做出响应，如果I/O接口不具备传送命令信息的功能，那么设备无法响应
组成：
通常在I/O接口中设有存放命令的**命令寄存器**以及**命令译码器**
- 命令寄存器用来存放I/O指令中的命令码，受设备选中信号控制
- 只有被选中设备的SEL信号有效，命令寄存器才能接受命令线上的命令码
3. 传送数据的功能
数据必须通过接口才能实现主机与I/O设备间的传送，要求接口中具有数据通路，完成数据传送，这种数据通路还应具有缓冲能力，能将数据暂存在接口内
组成：
接口中通常设有数据缓冲寄存器，用于暂时存I/O设备与主机准备交换的信息，与I/O总线中的数据线是相连的
4. 反映I/O设备工作状态的功能
使CPU能及时了解I/O设备的工作状态，接口内必须设置一些反映设备工作状态的触发器
组成：设备状态标记
- 完成触发器D
- 工作触发器B
- 中断请求触发器INTR
- 中断屏蔽触发器MASK
所有的状态标志触发器都要与I/O总线中的状态相连
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260101182544.png)

## 接口类型
1. 按数据传送方式分类
- 并行接口
- 串行接口
	- 由于接口与主机之间是按照字节或字并行传送，因此对串行接口而言，内部还必须设有串-并转换装置

2. 按功能选择的灵活性分类
- 可编程接口
- 不可编程接口

3. 按通用性分类
- 通用接口
- 专用接口

4. 按数据传送的控制方式分类
- 程序性接口
	- 用于连接速度较慢的I/O设备
>中断接口，现代计算机一般采用程序中断方式实现主机与I/O设备间的信息交换，故都配有这类接口

- DMA接口
	- 用于连接高速的I/O设备

# I/O设备与主机信息传送的控制方式
## 程序查询方式
程序查询方式的核心问题在于每时每刻**需不断查询I/O设备是否准备就绪**
### 程序查询流程
查询流程：
- 单个I/O设备
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102101515.png" alt="image.png" style="max-width:257px;width:100%;height:auto;">
- 多个I/O设备
当I/O设备较多时，CPU需按各个I/O设备在系统中的优先级进行逐级查询
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102101704.png" alt="image.png" style="max-width:250px;width:100%;height:auto;">
正确完成查询，执行：
- 测试指令：查询I/O设备是否准备就绪
- 传送指令：当I/O设备已准备就绪，执行传送指令
- 转移指令：若I/O设备未准备就绪，执行转移指令，转至测试指令，继续测试I/O设备的状态

查询查询方式的程序流程
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102102515.png" alt="image.png" style="max-width:165px;width:100%;height:auto;">

### 接口电路（大概率不考）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102103005.png)

## 程序中断方式
### 概念
中断：
计算机在执行程序的过程中，当出现异常情况或特殊请求时，计算机停止现行程序的运行，转向对这些异常情况或特殊请求的处理，处理结束后再返回到现行程序的间断处，继续执行原程序
I/O中断：
如果在设备准备的同时，CPU不做无谓的等待，而继续执行现行程序，只有当I/O设备准备就绪向CPU提出请求后，再暂时中断现行程序转入I/O服务程序，便产生I/O中断

中断处理的全过程：
- 中断请求
- 中断判优
- 中断响应
- 中断服务
- 中断返回

### 接口电路
1. 中断请求触发器和中断屏蔽触发器
中断请求触发器
每台外部设备都必须配置一个**中断请求触发器INTR**，当其为1时，表示该设备向CPU提出中断请求
注意：当设备欲提出中断请求时，其设备本身必须准备就绪，接口内的完成触发器D的状态必须为1

中断屏蔽触发器
当多个中断源同时提出请求时，CPU必须对各中断源的请求进行排队，且只能接受级别最高的中断源的请求，不允许级别低的中断源中断正在运行的中断服务程序，**设置屏蔽触发器MASK，当其为1时，表示被屏蔽，封锁其中断源的请求**
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102104743.png" alt="image.png" style="max-width:234px;width:100%;height:auto;">
仅当设备准备就绪（D=1),且该设备未被屏蔽（MASK=0),CPU的中断查询信号可将中断请求触发器置‘1’

2. 排队器
I/O中断而言，速度越高的I/O设备，优先级越高
[[中断系统]]
硬件方法：
- 在CPU内部设置一个统一的排队器，对所有的中断源进行排队
- 在接口电路中分别设置各个设备的排队器（链式排队器）
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102105610.png)

3. 中断向量地址形成部件
>设备编码器

硬件向量法：通过向量地址来寻找设备的中断服务程序入口地址，而且向量地址由硬件电路产生
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102110508.png)

<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102110446.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102110518.png)

### I/O中断处理过程
1. CPU响应中断的条件和时间
条件：
- 有中断请求
- CPU中的允许中断触发器EINT为1/IF=1
>该触发器可用于开中断/关中断
- CPU响应中断的时间一定是在每条指令执行阶段的结束时刻

时间：
当 D = 1（随机）且 MASK = 0 时
在每条指令执行阶段的结束时刻
CPU发中断查询信号（如果 D=1 且 MASK=0 则将 INTR 置“1”）

2. I/O中断处理过程
- 当CPU通过I/O指令中的地址码选中某设备
- CPU发启动I/O指令，将接口中的**B置1，D置0**
- 接口启动输入设备开始工作
- 输入设备将数据送入数据缓冲寄存器
- 输入设备向接口发出“**设备工作结束**”信号，**将D置1，B置0**，标志设备准备就绪
- 当D准备就绪（**D=1**)且本设备未被屏蔽(**MASK=0**)在指令执行阶段的结束时刻，由CPU发出中断查询信号
- **设备中断请求触发器INTR=1**，标志设备向CPU发出**中断请求**，与此同时，INTR送至排队器，进行**中断判优**
- 若**CPU允许中断（EINT=1)**，设备被排队选中，进入**中断响应阶段**，由**中断响应信号INTA**将排队器输出送至编码器形成向量地址
- 向量地址送至PC，作为下一条指令的地址
- 由于向量地址中存放的是一条无条件转移指令，故这条指令执行结束后，无条件转至设备的服务程序入口地址，开始执行中断服务程序，进入**中断服务**阶段，通过输入指令将数据缓冲寄存器的输入数据送至CPU的通用寄存器，再存入主存的相关单元
- 中断服务程序的最后一条指令是**中断返回**指令，当其执行结束时，即中断返回至原程序的断点处

3. 中断服务程序的流程
- [ ] 保护现场
- 保存程序断点---中断隐指令
- 保存通用寄存器和状态寄存器的内容---中断服务程序
- 存数指令、进栈指令
- [ ] 中断服务
- 对不同的 I/O 设备具有不同内容的设备服务
- [ ] 恢复现场
- 要求在退出服务程序前，将原程序中断时的现场恢复到原来的寄存器中
	- 取数指令、出栈指令
- [ ] 中断返回
- 返回到原程序的断点处，以便继续执行原程序
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102113845.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102114122.png)

### 特点
宏观上 CPU 和 I/O并行工作，提高了CPU的资源利用率
微观上CPU在处理中断服务程序时仍需暂停原程序的正常运行，尤其是当高速I/O设备或辅助存储器频繁地、成批地与主存交换信息，需不断打断CPU执行主程序而执行中断服务程序
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102114609.png" alt="image.png" style="max-width:375px;width:100%;height:auto;">

## DMA方式
### 特点
由于主存和DMA接口之间有一条数据通路，因此主存和设备交换信息时，不通过CPU，也需要CPU暂停现行程序为设备服务，因此工作速度比程序中断方式快
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102133218.png" alt="image.png" style="max-width:350px;width:100%;height:auto;">

特别适合：高速I/O或辅存与主存之间的信息交换

若出现高速I/O（通过DMA接口）和CPU同时访问主存，CPU必须将总线占有权给DMA接口使用---DMA接口采用周期窃取的方式占用一个存取周期
DMA与主存交换数据时采用办法
- 停止CPU访问主存<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102133935.png" alt="image.png" style="max-width:325px;width:100%;height:auto;">
	- 当外设要求传送一批数据时，由DMA接口向CPU发送一个停止信号，要求CPU放弃地址线、数据线和有关控制线的使用权，在数据传送结束后，DMA接口通知CPU可以使用主存，并把总线控制权交回给CPU
	- 优点：控制简单，适用于数据传输率很高的I/O设备实现成组数据的传送
	- 缺点：DMA接口访问主存时，CPU基本处于不工作状态或保持原状态，未充分发挥CPU对主存的利用率
- 周期挪用/周期窃取
	- 思想：每当I/O设备发出DMA请求时，I/O设备便挪用或窃取总线占用权一个或几个主存周期，而DMA不请求时，CPU仍继续访问主存
	- DMA访问主存三种情况
		- CPU此时不访问主存
		- I/O设备请求DMA传送时，CPU正在访问主存，此时必须待存取周期结束，CPU才能将总线占有权让出
		- I/O设备要求访问主存，CPU也要求访问主存
			- I/O访问优先于CPU访存
			- I/O不立即访问主存就可能丢失数据，这是I/O要窃取一两个存取周期，意味着CPU在执行访问主存指令过程中插入了DMA请求，并挪用了一两个存取周期
		- 适合于I/O设备的读写周期大于主存周期的情况![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102134838.png)
- DMA与CPU交替访问
	- 适合于CPU的工作周期比主存存取周期长的情况
	- **不需要总线使用权的申请、建立和归还过程**，总线使用权是通过C1、C2分别控制的![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102135320.png)

## DMA接口的功能和组成
>利用DMA方式传送数据时，数据的传输过程完全由DMA接口电路控制，故**DMA接口又有DMA控制器**之称

### 功能
- 向 CPU申请DMA 传送
- 在CPU允许DMA工作时，处理总线控制权的转交，避免因进入DMA工作而影响CPU正常活动或引起总线竞争
- 在DMA期间管理系统总线、控制数据传送
- 确定数据传送的内存首地址和长度、修正传送过程中的数据地址和长度
- 在数据块传送结束时，给出DMA操作完成信号

### 组成
1. 主存地址寄存器（AR）
主要用于存放主存中需要交换数据的地址
在DMA传送数据前，必须通过程序将数据在主存中的首地址送到主存地址寄存器，在DMA传送过程中，每交换一次数据，将地址寄存器内容加1，直到一批数据传送完毕为止

2. 字计数器（WC）
用于记录传送数据的**总字数**，通常以交换字数的补码值预置，在DMA传送过程中，每传送一个字，字计数器加1，直到计数器为0，即最高位产生进位时，表示该批数据传送完毕
于是DMA接口向CPU发中断请求信号

3. 数据缓冲寄存器（BR）
暂存每次传送的数据

4. DMA控制逻辑
负责DMA的传送过程，由控制电路、时序电路、命令状态寄存器等组成
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102141120.png)

5. 中断机构
当字计数器溢出时，表示一批数据交换完毕，由溢出信号通过中断机构向CPU提出中断请求，请求CPU作DMA操作的后处理

6. 设备地址寄存器(DAR)
存放设备的设备码或表示设备信息存储区的寻址地址
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102141517.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102133114.png)
## DMA工作过程
### DMA传送过程

![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102132614.png)
DMA的数据传送过程分为预处理、数据传送、后处理三个阶段
1. 预处理
在DMA接口开始工作之前，CPU执行几条输入输出指令给它预置如下信息
- 给DMA控制逻辑指明数据传送方向是输入（写主存）还是输出（读主存）
- 向DMA设备地址寄存器送入设备号，并启动程序
- 向DMA主存地址寄存器送入交换数据的主存起始地址
- 对字计数器赋予交换数据的个数

当 I/O 设备准备好发送的数据 (输入) 或上次接收的数据已经处理完毕 (输出) 时，它便通过DMA 接口向 CPU 提出占用总线的申请，若有多个 DMA 同时申请，则按轻重缓急由硬件排队判优逻辑决定优先等。待 I/O 设备得到主存总线的控制权后，数据的传送便由该 DMA 接口进行管理。

2. 数据传送
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102143825.png)
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102143837.png)

3. 后处理
转去执行中断服务程序，做一些DMA的结束工作
- 校验送入主存的数是否正确
- 是否继续用 DMA
- 测试传送过程是否正确，错则转诊断程序
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102144005.png)

### DMA接口与系统的连接方式
- 具有公共请求线的 DMA 请求
![image.png](https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102145849.png)

- 独立的 DMA 请求
<img src="https://picgorh.oss-cn-beijing.aliyuncs.com/image/20260102145903.png" alt="image.png" style="max-width:275px;width:100%;height:auto;">
### DMA vs 程序中断方式

| 比较维度   | 中断方式       | DMA方式   |
| ------ | ---------- | ------- |
| 数据传送   | 程序         | 硬件      |
| 响应时间   | 指令执行结束     | 存取周期结束  |
| 处理异常情况 | 有          | 没有      |
| 工作过程   | 程序切换       | 总线占有权切换 |
| 中断方式   | 中断现行程序保护现场 | 无需保护现场  |
| 优先级    | 低          | 高       |
