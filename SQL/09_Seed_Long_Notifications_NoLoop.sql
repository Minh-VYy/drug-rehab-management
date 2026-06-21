/* ============================================================
   FILE    : 09_Seed_Long_Notifications_NoLoop.sql
   PURPOSE : Bo sung du lieu THONGBAO noi dung dai de test giao dien xem chi tiet
   DBMS    : SQL Server
   NOTE    : Khong dung WHILE/CURSOR/vong lap. Co the chay lai nhieu lan.
             Chay sau 00_Rebuild_DB_And_Seed_API_Test.sql + 06 + 07.
   ============================================================ */

USE rehab_center_db;
GO

SET NOCOUNT ON;
GO

/* Xoa du lieu seed cu cua file nay de chay lai khong bi trung khoa chinh */
DELETE FROM ThongBao
WHERE MaThongBao LIKE 'TBLONG%';
GO

/* ============================================================
   INSERT THEM THONG BAO NOI DUNG DAI
   LoaiThongBao: TatCa / NoiBo / CaNhan
   TrangThai   : CHUA_DOC / DA_DOC
   ============================================================ */

INSERT INTO ThongBao
(MaThongBao, MaNhanVien, TieuDe, NoiDung, NgayTao, LoaiThongBao, TrangThai, MaNguoiDungNhan)
VALUES
('TBLONG0001', 'NS_STF01', N'Thông báo lịch thăm gặp thân nhân trong tuần này',
N'Trung tâm thông báo lịch thăm gặp thân nhân trong tuần này được tổ chức vào hai khung giờ chính: sáng từ 08:00 đến 10:30 và chiều từ 14:00 đến 16:30. Người thân khi đến trung tâm cần mang theo căn cước công dân hoặc giấy tờ tùy thân hợp lệ để cán bộ trực cổng đối chiếu thông tin.

Để bảo đảm trật tự và an toàn trong khu vực thăm gặp, mỗi người cai nghiện chỉ được đăng ký tối đa 03 người thân trong cùng một lượt thăm. Người đi cùng cần có tên trong phiếu đăng ký thăm gặp đã được phê duyệt trên hệ thống. Các trường hợp chưa có tên trong danh sách sẽ được hướng dẫn bổ sung thông tin nhưng có thể không được vào khu vực thăm gặp trong ngày.

Gia đình vui lòng không mang theo vật sắc nhọn, thuốc không rõ nguồn gốc, thực phẩm chưa qua kiểm tra hoặc các vật dụng không được phép. Mọi thắc mắc về lịch thăm gặp có thể gửi yêu cầu hỗ trợ trên hệ thống để nhân viên trung tâm phản hồi.',
DATEADD(day, -18, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0002', 'NS_STF01', N'Hướng dẫn chuẩn bị hồ sơ khi đến thăm gặp',
N'Người thân khi đến thăm gặp cần chuẩn bị đầy đủ thông tin đã khai báo trên hệ thống, bao gồm họ tên người thăm, số giấy tờ tùy thân, mối quan hệ với người cai nghiện và mã phiếu thăm gặp. Khi đến quầy tiếp nhận, vui lòng xuất trình giấy tờ bản gốc để cán bộ đối chiếu.

Nếu người thăm gặp đi cùng trẻ em hoặc người cao tuổi, gia đình cần thông báo trước để trung tâm bố trí khu vực chờ phù hợp. Trường hợp có thay đổi về số lượng người đi cùng hoặc thay đổi người đại diện, gia đình cần cập nhật yêu cầu trước thời điểm thăm gặp tối thiểu 24 giờ.

Trung tâm khuyến khích gia đình trao đổi với thái độ tích cực, động viên người cai nghiện thực hiện tốt phác đồ điều trị và tuân thủ nội quy sinh hoạt. Nội dung trao đổi cần phù hợp với mục tiêu phục hồi, tránh tạo áp lực tâm lý hoặc nhắc lại các sự việc có thể gây ảnh hưởng tiêu cực đến quá trình điều trị.',
DATEADD(day, -17, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0003', 'NS_STF01', N'Thông báo điều chỉnh thời gian tiếp nhận yêu cầu hỗ trợ',
N'Từ tuần này, bộ phận tiếp nhận yêu cầu hỗ trợ của trung tâm sẽ xử lý các yêu cầu được gửi qua hệ thống trong khung giờ hành chính từ 07:30 đến 17:00, từ thứ Hai đến thứ Sáu. Các yêu cầu gửi ngoài khung giờ trên vẫn được ghi nhận tự động và sẽ được phản hồi vào ngày làm việc tiếp theo.

Đối với các trường hợp khẩn cấp liên quan đến sức khỏe, tâm lý bất ổn hoặc cần trao đổi gấp với cán bộ phụ trách, người thân vui lòng ghi rõ mức độ khẩn cấp trong tiêu đề yêu cầu. Nội dung yêu cầu nên trình bày rõ vấn đề cần hỗ trợ, mã người cai nghiện nếu có và số điện thoại liên hệ để cán bộ trung tâm thuận tiện phản hồi.

Việc gửi yêu cầu hỗ trợ qua hệ thống giúp trung tâm lưu lại lịch sử xử lý, tránh thất lạc thông tin và bảo đảm mọi phản ánh đều được theo dõi. Gia đình vui lòng hạn chế gửi trùng nhiều yêu cầu cùng nội dung trong thời gian ngắn để tránh làm chậm quá trình phân loại.',
DATEADD(day, -16, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0004', 'NS_LD001', N'Thông báo chung về tăng cường phối hợp giữa trung tâm và gia đình',
N'Ban lãnh đạo trung tâm đề nghị người thân của người cai nghiện tăng cường phối hợp với cán bộ phụ trách trong suốt quá trình điều trị và phục hồi. Gia đình là yếu tố rất quan trọng giúp người cai nghiện ổn định tâm lý, duy trì động lực thay đổi hành vi và chuẩn bị tốt cho giai đoạn tái hòa nhập.

Trong quá trình theo dõi lộ trình phục hồi trên hệ thống, nếu gia đình nhận thấy thông tin chưa đầy đủ hoặc cần được giải thích thêm, vui lòng gửi yêu cầu hỗ trợ để trung tâm kiểm tra. Các thông tin liên quan đến sức khỏe, bệnh án và tiến trình điều trị sẽ được hiển thị theo đúng phạm vi được cấp quyền nhằm bảo đảm bảo mật dữ liệu cá nhân.

Trung tâm mong gia đình sử dụng hệ thống thường xuyên để cập nhật thông báo, lịch thăm gặp, lộ trình phục hồi và các hướng dẫn mới. Việc phối hợp đúng quy trình sẽ giúp quá trình điều trị được minh bạch, nhất quán và hiệu quả hơn.',
DATEADD(day, -15, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0005', 'NS_STF01', N'Thông báo bảo trì hệ thống vào cuối tuần',
N'Hệ thống quản lý trung tâm sẽ được bảo trì định kỳ vào tối thứ Bảy tuần này, từ 22:00 đến 23:30. Trong thời gian bảo trì, một số chức năng như đăng ký thăm gặp, gửi yêu cầu hỗ trợ, tra cứu thông báo và xem lộ trình phục hồi có thể tạm thời bị gián đoạn.

Người dùng vui lòng hoàn tất các thao tác cần thiết trước thời điểm bảo trì. Các dữ liệu đã gửi trước thời gian bảo trì sẽ được lưu trữ an toàn và không bị mất. Nếu người dùng đang thao tác trên biểu mẫu trong thời gian hệ thống bắt đầu bảo trì, vui lòng lưu lại nội dung hoặc gửi lại sau khi hệ thống hoạt động bình thường.

Sau khi bảo trì hoàn tất, trung tâm sẽ tiếp tục kiểm tra các chức năng chính để bảo đảm hệ thống vận hành ổn định. Nếu phát hiện lỗi hiển thị hoặc không truy cập được tài khoản, người dùng có thể gửi phản hồi qua bộ phận hỗ trợ kỹ thuật.',
DATEADD(day, -14, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0006', 'NS_STF01', N'Nội quy khi tham gia khu vực thăm gặp',
N'Khi tham gia khu vực thăm gặp, người thân cần tuân thủ hướng dẫn của cán bộ trung tâm, giữ trật tự chung và không tự ý di chuyển sang các khu vực không được phép. Khu vực thăm gặp được bố trí nhằm tạo môi trường trao đổi an toàn, phù hợp với mục tiêu phục hồi và bảo đảm công tác quản lý của trung tâm.

Người thân không được tự ý đưa vật phẩm, thuốc, thực phẩm hoặc tiền mặt cho người cai nghiện nếu chưa được cán bộ phụ trách kiểm tra và cho phép. Mọi vật dụng hỗ trợ cần gửi qua bộ phận tiếp nhận để ghi nhận và xử lý theo đúng quy định. Việc tự ý trao đổi vật phẩm có thể làm ảnh hưởng đến an toàn điều trị và nội quy của trung tâm.

Trường hợp người thân có nhu cầu trao đổi riêng với cán bộ phụ trách về tình trạng phục hồi của người cai nghiện, vui lòng đăng ký trước hoặc gửi yêu cầu hỗ trợ trên hệ thống để được sắp xếp lịch phù hợp.',
DATEADD(day, -13, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0007', 'NS_STF01', N'Cập nhật quy định nhận thông báo từ trung tâm',
N'Trung tâm đã cập nhật cơ chế hiển thị thông báo trên hệ thống. Người dùng sau khi đăng nhập có thể xem các thông báo chung, thông báo nội bộ theo vai trò và thông báo cá nhân được gửi riêng. Các thông báo chưa đọc sẽ được đánh dấu để người dùng dễ theo dõi.

Đối với thông báo cá nhân, nội dung có thể liên quan đến lịch thăm gặp, phản hồi yêu cầu hỗ trợ hoặc tình trạng xử lý hồ sơ. Người dùng cần kiểm tra mục thông báo thường xuyên để không bỏ lỡ thông tin quan trọng. Sau khi mở chi tiết thông báo, hệ thống có thể cập nhật trạng thái từ chưa đọc sang đã đọc.

Nếu giao diện thông báo không hiển thị đầy đủ nội dung, người dùng nên tải lại trang hoặc đăng xuất và đăng nhập lại. Trường hợp lỗi vẫn tiếp diễn, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ.',
DATEADD(day, -12, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0008', 'NS_STF01', N'Lưu ý về việc cập nhật thông tin cá nhân',
N'Người dùng cần bảo đảm thông tin cá nhân trên hệ thống luôn chính xác, đặc biệt là số điện thoại, email, địa chỉ liên hệ và thông tin giấy tờ tùy thân. Những thông tin này được sử dụng để xác minh khi đăng ký thăm gặp, gửi yêu cầu hỗ trợ hoặc nhận phản hồi từ trung tâm.

Nếu có thay đổi về số điện thoại hoặc email, người dùng cần cập nhật sớm trong mục hồ sơ cá nhân. Trường hợp thông tin không chính xác, trung tâm có thể gặp khó khăn trong việc liên hệ hoặc xác nhận hồ sơ. Đối với người thân của người cai nghiện, thông tin liên hệ chính xác còn giúp trung tâm thông báo kịp thời các thay đổi về lịch thăm gặp hoặc lộ trình phục hồi.

Mọi thay đổi thông tin quan trọng có thể được hệ thống ghi nhận để phục vụ kiểm tra và bảo mật. Người dùng không chia sẻ tài khoản cho người khác nhằm tránh rủi ro lộ thông tin cá nhân.',
DATEADD(day, -11, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0009', 'NS_LD001', N'Thông báo về đợt đánh giá phục hồi định kỳ',
N'Trung tâm sẽ thực hiện đợt đánh giá phục hồi định kỳ cho người cai nghiện trong tháng này. Nội dung đánh giá bao gồm tình trạng sức khỏe, mức độ tuân thủ phác đồ điều trị, tham gia hoạt động sinh hoạt, kết quả tư vấn tâm lý và khả năng thích nghi với môi trường phục hồi.

Kết quả đánh giá sẽ là căn cứ để bác sĩ và cán bộ quản lý xem xét việc điều chỉnh phác đồ điều trị, đề xuất chuyển giai đoạn hoặc tiếp tục theo dõi thêm. Gia đình có thể xem một số thông tin tổng quan được phép hiển thị trên hệ thống, tùy theo phạm vi bảo mật và quyền truy cập.

Trung tâm khuyến khích gia đình theo dõi thông báo thường xuyên để nắm được các mốc quan trọng trong quá trình phục hồi. Các thông tin chuyên môn chi tiết sẽ do cán bộ phụ trách hoặc bác sĩ giải thích khi cần thiết.',
DATEADD(day, -10, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0010', 'NS_STF01', N'Hướng dẫn sử dụng mục yêu cầu hỗ trợ',
N'Mục yêu cầu hỗ trợ trên hệ thống được dùng để người thân gửi câu hỏi, phản ánh hoặc đề nghị trung tâm hỗ trợ các vấn đề liên quan đến hồ sơ, lịch thăm gặp, thông báo, thông tin phục hồi hoặc hướng dẫn sử dụng hệ thống. Khi gửi yêu cầu, người dùng nên chọn tiêu đề rõ ràng và mô tả đầy đủ nội dung cần được hỗ trợ.

Một yêu cầu hỗ trợ tốt nên có các thông tin: vấn đề đang gặp phải, thời điểm phát sinh, mã hồ sơ hoặc mã người cai nghiện nếu có, ảnh chụp màn hình trong trường hợp lỗi giao diện và số điện thoại liên hệ. Những thông tin này giúp nhân viên trung tâm phân loại và phản hồi nhanh hơn.

Sau khi gửi yêu cầu, người dùng có thể theo dõi trạng thái xử lý trong lịch sử yêu cầu hỗ trợ. Nếu yêu cầu đã được phản hồi nhưng người dùng vẫn cần trao đổi thêm, có thể gửi yêu cầu mới và ghi rõ nội dung liên quan đến phản hồi trước đó.',
DATEADD(day, -9, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0011', 'NS_STF01', N'Thông báo cá nhân về phản hồi yêu cầu hỗ trợ',
N'Yêu cầu hỗ trợ gần đây của gia đình đã được nhân viên trung tâm tiếp nhận và phản hồi. Nội dung phản hồi bao gồm hướng dẫn kiểm tra lại thông tin lịch thăm gặp, cách xem trạng thái phiếu thăm gặp và cách cập nhật thông tin người đi cùng trong trường hợp có thay đổi.

Gia đình vui lòng đăng nhập vào hệ thống, vào mục Yêu cầu hỗ trợ, mở chi tiết yêu cầu đã gửi để xem đầy đủ nội dung phản hồi. Nếu vấn đề đã được giải quyết, không cần gửi thêm yêu cầu mới. Nếu còn vướng mắc, gia đình có thể gửi yêu cầu bổ sung với tiêu đề rõ ràng để cán bộ trung tâm tiếp tục hỗ trợ.

Trung tâm lưu ý rằng các phản hồi qua hệ thống chỉ có giá trị hướng dẫn theo hồ sơ hiện có. Đối với các trường hợp cần xác minh trực tiếp, cán bộ trung tâm có thể liên hệ qua số điện thoại đã đăng ký.',
DATEADD(day, -8, GETDATE()), 'CaNhan', 'CHUA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api')),

('TBLONG0012', 'NS_STF01', N'Thông báo cá nhân về lịch thăm gặp đã được duyệt',
N'Phiếu đăng ký thăm gặp của gia đình đã được phê duyệt. Thời gian thăm gặp dự kiến là buổi sáng theo ca đã đăng ký trên hệ thống. Gia đình vui lòng đến trước giờ hẹn khoảng 15 phút để hoàn tất kiểm tra giấy tờ và nhận hướng dẫn từ nhân viên trực.

Khi đến trung tâm, người đại diện cần mang theo giấy tờ tùy thân trùng khớp với thông tin đã đăng ký. Người đi cùng cũng cần có giấy tờ xác minh và có tên trong danh sách người đi cùng của phiếu thăm gặp. Trường hợp đến muộn quá thời gian quy định, phiếu thăm gặp có thể bị chuyển sang trạng thái không thực hiện được.

Gia đình vui lòng đọc kỹ nội quy thăm gặp trước khi đến trung tâm. Nếu có nhu cầu hủy lịch hoặc thay đổi thông tin, cần thực hiện trên hệ thống trước thời điểm thăm gặp để trung tâm sắp xếp lại lịch phù hợp.',
DATEADD(day, -8, GETDATE()), 'CaNhan', 'DA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api')),

('TBLONG0013', 'NS_STF01', N'Thông báo cá nhân về hồ sơ đăng ký tự nguyện',
N'Hồ sơ đăng ký cai nghiện tự nguyện của gia đình đã được ghi nhận trên hệ thống. Bộ phận tiếp nhận đang kiểm tra thông tin cá nhân, giấy tờ xác minh, tình trạng sức khỏe ban đầu và các thông tin liên quan đến quá trình sử dụng chất gây nghiện.

Trong thời gian hồ sơ đang được xem xét, gia đình cần theo dõi trạng thái đơn trong mục Lịch sử đơn đăng ký. Nếu hồ sơ cần bổ sung thông tin, hệ thống sẽ hiển thị thông báo hoặc nhân viên trung tâm sẽ liên hệ qua số điện thoại đã đăng ký. Việc bổ sung thông tin kịp thời giúp quá trình tiếp nhận diễn ra nhanh hơn.

Gia đình không cần gửi lại hồ sơ mới nếu hồ sơ cũ vẫn đang ở trạng thái chờ xử lý. Trường hợp phát hiện thông tin khai báo sai, vui lòng gửi yêu cầu hỗ trợ để nhân viên hướng dẫn điều chỉnh.',
DATEADD(day, -7, GETDATE()), 'CaNhan', 'CHUA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api')),

('TBLONG0014', 'NS_BS001', N'Thông báo nội bộ về cập nhật hồ sơ bệnh án',
N'Đề nghị các bác sĩ phụ trách kiểm tra lại danh sách hồ sơ bệnh án được phân công và cập nhật thông tin y tế cần thiết sau mỗi lần thăm khám. Các trường thông tin quan trọng gồm tiền sử bệnh, dị ứng, chiều cao, cân nặng, tình trạng sức khỏe hiện tại và thời điểm cập nhật cuối.

Việc cập nhật bệnh án đầy đủ giúp cán bộ quản lý và lãnh đạo trung tâm có dữ liệu chính xác khi xem xét phác đồ điều trị, đề xuất chuyển giai đoạn hoặc đề xuất hoàn thành cai nghiện. Hồ sơ bệnh án cần được ghi nhận khách quan, rõ ràng và phù hợp với thực tế theo dõi.

Nếu hồ sơ bệnh án thiếu thông tin hoặc dữ liệu chưa thống nhất, bác sĩ phụ trách cần kiểm tra lại với nhân viên tiếp nhận hoặc cán bộ quản lý trước khi cập nhật. Không tự ý xóa các thông tin có giá trị lịch sử nếu chưa có xác nhận.',
DATEADD(day, -7, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),

('TBLONG0015', 'NS_QL001', N'Thông báo nội bộ về phê duyệt phác đồ điều trị',
N'Cán bộ quản lý cần kiểm tra các phác đồ điều trị đang ở trạng thái chờ phê duyệt. Khi xem xét phác đồ, cần đối chiếu thông tin bệnh án, loại ma túy sử dụng, giai đoạn điều trị, mục tiêu điều trị và thời gian dự kiến áp dụng.

Nếu phác đồ phù hợp, cán bộ quản lý cập nhật trạng thái phê duyệt và ghi chú rõ ràng. Nếu phác đồ chưa phù hợp hoặc cần bác sĩ bổ sung thông tin, cần từ chối kèm lý do cụ thể để bác sĩ điều chỉnh. Việc ghi chú đầy đủ giúp quá trình xử lý minh bạch và tránh nhầm lẫn khi tra cứu lịch sử.

Các phác đồ đã phê duyệt sẽ được sử dụng làm căn cứ cho hoạt động điều trị tiếp theo. Vì vậy, không nên phê duyệt khi nội dung phác đồ còn thiếu mục tiêu, thiếu thời gian áp dụng hoặc chưa phù hợp với giai đoạn hiện tại của người cai nghiện.',
DATEADD(day, -6, GETDATE()), 'NoiBo', 'DA_DOC', NULL),

('TBLONG0016', 'NS_LD001', N'Thông báo nội bộ về phê duyệt tiếp nhận hồ sơ bàn giao',
N'Ban lãnh đạo đề nghị bộ phận có thẩm quyền kiểm tra kỹ các hồ sơ bàn giao người cai nghiện do cơ quan công an gửi đến trước khi cập nhật trạng thái tiếp nhận. Hồ sơ cần có thông tin đối tượng, giấy tờ pháp lý kèm theo, hành vi vi phạm hoặc lý do bàn giao, thông tin người thân liên hệ và đơn vị gửi hồ sơ.

Khi hồ sơ đủ điều kiện, trạng thái được cập nhật thành đã tiếp nhận để hệ thống tiếp tục tạo hồ sơ người cai nghiện. Nếu hồ sơ chưa đủ điều kiện hoặc thiếu giấy tờ bắt buộc, cần cập nhật trạng thái từ chối và ghi nhận lý do xử lý theo quy trình nội bộ.

Việc phê duyệt tiếp nhận cần được thực hiện cẩn trọng vì đây là bước đầu tiên trong quy trình quản lý chính thức tại trung tâm. Mọi thay đổi trạng thái cần được ghi nhận thời gian xử lý và nhân sự thực hiện duyệt.',
DATEADD(day, -6, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),

('TBLONG0017', 'NS_LD001', N'Thông báo nội bộ về phê duyệt hoàn thành cai nghiện',
N'Đối với các hồ sơ đề xuất hoàn thành cai nghiện, lãnh đạo trung tâm cần xem xét trên nhiều căn cứ: kết quả điều trị, đánh giá tâm lý, mức độ tham gia sinh hoạt, thái độ tuân thủ nội quy, nhận xét của bác sĩ phụ trách và quá trình theo dõi tại trung tâm.

Không nên phê duyệt hoàn thành nếu hồ sơ còn thiếu nhận xét chuyên môn hoặc chưa có đủ dữ liệu đánh giá phục hồi. Trường hợp cần bổ sung thông tin, lãnh đạo có thể từ chối đề xuất và yêu cầu bác sĩ hoặc cán bộ phụ trách cập nhật thêm nội dung cần thiết.

Khi đề xuất được phê duyệt, hệ thống sẽ ghi nhận thời điểm phê duyệt và trạng thái xử lý. Dữ liệu này phục vụ báo cáo tổng quan, thống kê kết quả phục hồi và tra cứu lịch sử quản lý.',
DATEADD(day, -5, GETDATE()), 'NoiBo', 'DA_DOC', NULL),

('TBLONG0018', 'NS_ADM01', N'Thông báo nội bộ về bảo mật tài khoản hệ thống',
N'Quản trị hệ thống nhắc nhở tất cả người dùng nội bộ không chia sẻ tài khoản đăng nhập, mật khẩu hoặc mã xác thực cho người khác. Mỗi tài khoản được gắn với vai trò và phạm vi truy cập riêng, do đó việc dùng chung tài khoản có thể gây sai lệch lịch sử xử lý và ảnh hưởng đến bảo mật dữ liệu.

Khi phát hiện tài khoản có dấu hiệu đăng nhập bất thường, người dùng cần báo ngay cho quản trị hệ thống để kiểm tra và tạm khóa nếu cần thiết. Các tài khoản không còn sử dụng, nhân sự đã nghỉ việc hoặc chuyển công tác cần được cập nhật trạng thái kịp thời.

Dữ liệu của người cai nghiện và gia đình là dữ liệu nhạy cảm, cần được xử lý cẩn trọng. Người dùng nội bộ chỉ được truy cập thông tin phục vụ đúng nhiệm vụ được phân công.',
DATEADD(day, -5, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),

('TBLONG0019', 'NS_ADM01', N'Thông báo cập nhật danh mục thuốc phục vụ điều trị',
N'Quản trị hệ thống đã cập nhật thêm một số danh mục thuốc phục vụ cho việc lập lịch uống thuốc và theo dõi điều trị. Các bác sĩ khi tạo lịch uống thuốc cần chọn đúng thuốc trong danh mục, kiểm tra đơn vị tính, liều lượng và tần suất sử dụng trước khi lưu.

Trường hợp danh mục thuốc chưa có thuốc cần sử dụng, bác sĩ hoặc cán bộ phụ trách có thể gửi yêu cầu bổ sung danh mục đến quản trị hệ thống. Yêu cầu cần ghi rõ tên thuốc, đơn vị tính, ghi chú sử dụng và các thông tin cần thiết để tránh nhầm lẫn khi nhập liệu.

Việc quản lý danh mục thuốc tập trung giúp hạn chế nhập sai tên thuốc, thống nhất dữ liệu điều trị và hỗ trợ thống kê số lượng thuốc khi cần thiết.',
DATEADD(day, -4, GETDATE()), 'NoiBo', 'DA_DOC', NULL),

('TBLONG0020', 'NS_ADM01', N'Thông báo cập nhật danh mục hoạt động sinh hoạt',
N'Hệ thống đã bổ sung và chuẩn hóa danh mục hoạt động sinh hoạt trong trung tâm. Nhân viên khi lập lịch sinh hoạt cần chọn đúng loại hoạt động như giáo dục, lao động trị liệu, thể thao, tư vấn nhóm hoặc hoạt động phục hồi kỹ năng sống.

Mỗi lịch sinh hoạt cần có thời gian bắt đầu, thời gian kết thúc, địa điểm và cán bộ phụ trách rõ ràng. Sau khi hoạt động diễn ra, nhân viên cần thực hiện điểm danh để dữ liệu tham gia của người cai nghiện được cập nhật đầy đủ.

Dữ liệu lịch sinh hoạt và điểm danh là một trong các căn cứ đánh giá mức độ tuân thủ, thái độ tham gia và tiến trình phục hồi của người cai nghiện. Vì vậy, việc nhập liệu cần chính xác và đúng thời điểm.',
DATEADD(day, -4, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),

('TBLONG0021', 'NS_STF01', N'Thông báo về lịch sinh hoạt phục hồi kỹ năng sống',
N'Trung tâm sẽ tổ chức buổi sinh hoạt phục hồi kỹ năng sống với chủ đề quản lý cảm xúc và xây dựng thói quen tích cực. Hoạt động nhằm giúp người cai nghiện nhận diện các yếu tố nguy cơ, rèn luyện cách kiểm soát cảm xúc và hình thành kế hoạch sinh hoạt lành mạnh.

Nhân viên phụ trách cần chuẩn bị danh sách học viên, tài liệu hướng dẫn, khu vực sinh hoạt và biểu mẫu điểm danh. Sau khi kết thúc buổi sinh hoạt, nhân viên cập nhật kết quả điểm danh và ghi chú các trường hợp vắng mặt, đi trễ hoặc cần hỗ trợ thêm.

Gia đình có thể xem thông tin tổng quan về lộ trình phục hồi nếu được cấp quyền. Những nội dung chi tiết liên quan đến đánh giá tâm lý sẽ được bảo mật theo quy định của trung tâm.',
DATEADD(day, -3, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0022', 'NS_STF01', N'Thông báo về quy trình hủy lịch thăm gặp',
N'Người thân có nhu cầu hủy lịch thăm gặp cần thực hiện trên hệ thống trước thời điểm thăm gặp tối thiểu 24 giờ. Khi hủy lịch, người dùng nên ghi rõ lý do để nhân viên trung tâm nắm thông tin và bố trí lại khung giờ phù hợp nếu cần.

Sau khi hủy lịch, trạng thái phiếu thăm gặp sẽ được cập nhật trên hệ thống. Gia đình có thể đăng ký lại lịch thăm gặp mới theo các khung giờ còn trống. Trong trường hợp hủy lịch sát giờ hoặc không đến theo lịch đã được phê duyệt, trung tâm có thể ghi nhận để phục vụ công tác quản lý lịch thăm gặp.

Việc hủy lịch đúng quy trình giúp trung tâm sắp xếp nhân sự, phòng thăm gặp và bảo đảm quyền đăng ký cho các gia đình khác.',
DATEADD(day, -3, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0023', 'NS_BS001', N'Thông báo cá nhân gửi bác sĩ về hồ sơ cần cập nhật',
N'Hệ thống ghi nhận một số hồ sơ bệnh án được phân công cho bác sĩ đang thiếu thông tin cập nhật gần nhất. Bác sĩ vui lòng kiểm tra danh sách hồ sơ bệnh án trong module Cập nhật hồ sơ bệnh án, đặc biệt là các trường tiền sử bệnh, dị ứng, chiều cao, cân nặng và ngày cập nhật cuối.

Việc cập nhật đầy đủ hồ sơ bệnh án giúp bảo đảm dữ liệu đầu vào cho phác đồ điều trị và các đề xuất chuyển giai đoạn. Nếu thông tin cần xác minh thêm, bác sĩ có thể ghi chú trong bệnh án hoặc trao đổi với nhân viên tiếp nhận trước khi lưu thay đổi.

Sau khi hoàn tất cập nhật, bác sĩ nên kiểm tra lại bảng danh sách để bảo đảm dữ liệu hiển thị đúng. Nếu gặp lỗi khi lưu, vui lòng báo bộ phận kỹ thuật hoặc quản trị hệ thống.',
DATEADD(day, -2, GETDATE()), 'CaNhan', 'CHUA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'doctor_api')),

('TBLONG0024', 'NS_QL001', N'Thông báo cá nhân gửi cán bộ quản lý về phác đồ chờ duyệt',
N'Hệ thống hiện có các phác đồ điều trị đang chờ cán bộ quản lý xem xét. Cán bộ quản lý vui lòng truy cập module Phê duyệt phác đồ điều trị để kiểm tra nội dung chi tiết, mục tiêu điều trị, thời gian áp dụng và trạng thái hiện tại.

Khi phê duyệt, cần nhập ghi chú phù hợp để lưu lại căn cứ xử lý. Khi từ chối, cần ghi rõ lý do để bác sĩ phụ trách có thể điều chỉnh và gửi lại. Các phác đồ đã xử lý sẽ được thống kê trên dashboard phục vụ theo dõi tiến độ phê duyệt.

Để tránh chậm trễ trong điều trị, đề nghị xử lý các phác đồ chờ duyệt trong ngày làm việc nếu hồ sơ đã đầy đủ thông tin.',
DATEADD(day, -2, GETDATE()), 'CaNhan', 'DA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'manager_api')),

('TBLONG0025', 'NS_LD001', N'Thông báo cá nhân gửi lãnh đạo về hồ sơ tiếp nhận chờ duyệt',
N'Hệ thống ghi nhận một số hồ sơ bàn giao đang ở trạng thái chờ duyệt tiếp nhận. Lãnh đạo trung tâm vui lòng truy cập module Phê duyệt tiếp nhận người cai nghiện để xem chi tiết hồ sơ, thông tin đối tượng, file quyết định, hành vi vi phạm và thông tin người thân liên hệ.

Khi phê duyệt tiếp nhận, hệ thống sẽ ghi nhận nhân sự duyệt và thời gian duyệt. Nếu hồ sơ chưa đủ điều kiện, cần cập nhật trạng thái từ chối và ghi chú lý do để bộ phận liên quan xử lý tiếp.

Việc xử lý kịp thời hồ sơ tiếp nhận giúp quy trình quản lý người cai nghiện không bị gián đoạn và hỗ trợ thống kê chính xác tình hình tiếp nhận tại trung tâm.',
DATEADD(day, -2, GETDATE()), 'CaNhan', 'CHUA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'leader_api')),

('TBLONG0026', 'NS_STF01', N'Thông báo về kiểm tra sức khỏe định kỳ',
N'Trung tâm sẽ triển khai kiểm tra sức khỏe định kỳ cho người cai nghiện theo danh sách được phân công. Nội dung kiểm tra bao gồm đo huyết áp, nhịp tim, cân nặng, đánh giá tình trạng sức khỏe tổng quát và ghi nhận các triệu chứng bất thường nếu có.

Bác sĩ và nhân viên phụ trách cần cập nhật kết quả kiểm tra vào hồ sơ bệnh án hoặc nhật ký điều trị theo đúng phạm vi nghiệp vụ. Trường hợp phát hiện dấu hiệu bất thường, cần báo cáo kịp thời để có hướng xử lý phù hợp.

Gia đình người cai nghiện có thể nhận được thông báo tổng quan nếu có thông tin cần phối hợp. Các thông tin chuyên môn chi tiết vẫn được bảo mật theo quy định.',
DATEADD(day, -1, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0027', 'NS_STF01', N'Thông báo về chương trình tư vấn tâm lý nhóm',
N'Trung tâm sẽ tổ chức chương trình tư vấn tâm lý nhóm với mục tiêu hỗ trợ người cai nghiện chia sẻ khó khăn, nhận diện nguy cơ tái nghiện và học cách xây dựng kế hoạch phục hồi cá nhân. Chương trình được thực hiện bởi cán bộ phụ trách chuyên môn và bác sĩ tâm lý.

Người cai nghiện tham gia cần có mặt đúng giờ, tuân thủ hướng dẫn của cán bộ phụ trách và giữ thái độ tôn trọng trong quá trình sinh hoạt nhóm. Nhân viên phụ trách cần cập nhật danh sách tham gia và ghi nhận những trường hợp cần tư vấn cá nhân sau buổi sinh hoạt.

Kết quả tham gia tư vấn là một phần dữ liệu tham khảo trong quá trình đánh giá phục hồi. Gia đình có thể được thông báo tổng quan về tiến trình nếu phù hợp với quy định bảo mật.',
DATEADD(hour, -20, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0028', 'NS_STF01', N'Thông báo nhắc kiểm tra mục thông báo thường xuyên',
N'Hệ thống khuyến nghị người dùng kiểm tra mục thông báo ít nhất một lần mỗi ngày để không bỏ lỡ các nội dung quan trọng liên quan đến lịch thăm gặp, yêu cầu hỗ trợ, phê duyệt hồ sơ, thay đổi lịch sinh hoạt hoặc các cập nhật từ trung tâm.

Các thông báo chưa đọc sẽ được hiển thị với trạng thái riêng để người dùng dễ nhận biết. Khi mở chi tiết thông báo, người dùng có thể đọc toàn bộ nội dung hướng dẫn, lưu ý và các bước cần thực hiện nếu có.

Trường hợp người dùng đã đọc thông báo nhưng vẫn chưa hiểu nội dung hoặc cần hỗ trợ thêm, có thể gửi yêu cầu hỗ trợ kèm mã thông báo hoặc tiêu đề thông báo để nhân viên trung tâm kiểm tra nhanh hơn.',
DATEADD(hour, -18, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0029', 'NS_STF01', N'Thông báo về nguyên tắc bảo mật thông tin bệnh án',
N'Thông tin bệnh án của người cai nghiện chỉ được hiển thị cho các tài khoản có quyền phù hợp. Người thân chỉ có thể xem các thông tin được trung tâm cho phép và không được chia sẻ thông tin này cho bên thứ ba nếu chưa có sự đồng ý hoặc căn cứ hợp lệ.

Bác sĩ, cán bộ quản lý và nhân viên trung tâm khi truy cập dữ liệu bệnh án cần sử dụng đúng mục đích nghiệp vụ. Mọi thao tác cập nhật, phê duyệt hoặc tra cứu cần được thực hiện trên tài khoản cá nhân để bảo đảm khả năng truy vết khi cần.

Việc bảo mật thông tin bệnh án là yêu cầu quan trọng nhằm bảo vệ quyền riêng tư của người cai nghiện và gia đình, đồng thời bảo đảm tính chuyên nghiệp của trung tâm trong quá trình quản lý điều trị.',
DATEADD(hour, -16, GETDATE()), 'TatCa', 'DA_DOC', NULL),

('TBLONG0030', 'NS_STF01', N'Thông báo về tiếp nhận phản ánh lỗi giao diện',
N'Trong quá trình sử dụng hệ thống, nếu người dùng phát hiện lỗi hiển thị, không tải được dữ liệu, không mở được chi tiết thông báo hoặc thông tin trên giao diện chưa đúng, vui lòng gửi phản ánh qua mục Yêu cầu hỗ trợ.

Khi gửi phản ánh lỗi, người dùng nên mô tả rõ đang sử dụng tài khoản vai trò nào, đang ở màn hình nào, thao tác nào gây lỗi và thời điểm xảy ra lỗi. Nếu có thể, đính kèm ảnh chụp màn hình hoặc ghi lại nội dung thông báo lỗi để bộ phận kỹ thuật dễ kiểm tra.

Các phản ánh sẽ được phân loại theo mức độ ảnh hưởng. Những lỗi liên quan đến đăng nhập, phân quyền và hiển thị dữ liệu quan trọng sẽ được ưu tiên xử lý trước.',
DATEADD(hour, -12, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0031', 'NS_STF01', N'Cập nhật hướng dẫn xem chi tiết thông báo',
N'Để xem chi tiết thông báo, người dùng vào mục Thông báo trên thanh menu, chọn thông báo cần xem trong danh sách và nhấn vào tiêu đề hoặc nút Xem chi tiết. Hệ thống sẽ hiển thị toàn bộ nội dung thông báo, bao gồm tiêu đề, người gửi, thời gian tạo, loại thông báo, trạng thái đọc và nội dung chi tiết.

Nếu thông báo có nhiều đoạn nội dung, người dùng nên đọc hết phần hướng dẫn trước khi thực hiện thao tác liên quan. Một số thông báo có thể chứa quy định, lưu ý, thời hạn xử lý hoặc yêu cầu chuẩn bị giấy tờ. Việc đọc không đầy đủ có thể dẫn đến thiếu thông tin khi thực hiện đăng ký, cập nhật hoặc phản hồi.

Sau khi xem chi tiết, thông báo có thể được chuyển sang trạng thái đã đọc để người dùng dễ phân biệt với các thông báo mới.',
DATEADD(hour, -10, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0032', 'NS_LD001', N'Thông báo tổng hợp phục vụ báo cáo cuối tháng',
N'Ban lãnh đạo đề nghị các bộ phận kiểm tra và cập nhật đầy đủ dữ liệu trước thời điểm tổng hợp báo cáo cuối tháng. Các dữ liệu cần chú ý gồm hồ sơ tiếp nhận, hồ sơ đang điều trị, đề xuất hoàn thành cai nghiện, lịch sinh hoạt, điểm danh, yêu cầu hỗ trợ và lịch thăm gặp.

Dữ liệu thống kê chỉ chính xác khi các bộ phận cập nhật kịp thời và đúng trạng thái. Những hồ sơ đang chờ xử lý quá lâu cần được rà soát để xác định nguyên nhân, tránh ảnh hưởng đến báo cáo tổng quan và đánh giá hiệu quả vận hành của trung tâm.

Sau khi hoàn tất cập nhật, các bộ phận có thể đối chiếu số liệu trên dashboard với danh sách chi tiết để phát hiện sai lệch nếu có.',
DATEADD(hour, -8, GETDATE()), 'NoiBo', 'DA_DOC', NULL),

('TBLONG0033', 'NS_ADM01', N'Thông báo nội bộ về kiểm tra phân quyền menu',
N'Quản trị hệ thống đề nghị kiểm tra lại việc hiển thị menu theo từng vai trò sau khi cập nhật giao diện. Mỗi vai trò chỉ nên nhìn thấy các chức năng thuộc phạm vi được phân công nhằm tránh nhầm lẫn khi sử dụng và bảo đảm an toàn dữ liệu.

Các vai trò cần kiểm tra gồm người thân, công an, nhân viên trung tâm, bác sĩ, cán bộ quản lý, lãnh đạo trung tâm và quản trị hệ thống. Nếu phát hiện tài khoản hiển thị sai menu hoặc truy cập được màn hình không đúng vai trò, cần báo ngay cho quản trị hệ thống để điều chỉnh cấu hình.

Việc kiểm tra phân quyền giao diện cần đi kèm kiểm tra phân quyền API ở backend để tránh trường hợp người dùng ẩn menu nhưng vẫn gọi được dữ liệu không thuộc quyền truy cập.',
DATEADD(hour, -7, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),

('TBLONG0034', 'NS_STF01', N'Thông báo cho gia đình về kết quả tham gia hoạt động phục hồi',
N'Trung tâm ghi nhận người cai nghiện đã tham gia đầy đủ một số hoạt động phục hồi trong tuần, bao gồm sinh hoạt nhóm, tư vấn tâm lý và hoạt động rèn luyện kỹ năng sống. Đây là tín hiệu tích cực trong quá trình điều trị và phục hồi hành vi.

Gia đình nên tiếp tục động viên, khuyến khích tinh thần hợp tác và thái độ tích cực của người cai nghiện. Khi thăm gặp, gia đình nên tập trung trao đổi theo hướng hỗ trợ, ghi nhận nỗ lực thay đổi và tránh tạo áp lực quá mức.

Các thông tin chi tiết hơn về tiến trình phục hồi sẽ được cập nhật trong mục Lộ trình phục hồi hoặc được cán bộ phụ trách trao đổi khi cần thiết.',
DATEADD(hour, -6, GETDATE()), 'CaNhan', 'CHUA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api')),

('TBLONG0035', 'NS_STF01', N'Thông báo cá nhân về yêu cầu bổ sung thông tin người đi cùng',
N'Phiếu thăm gặp của gia đình cần bổ sung thông tin người đi cùng để trung tâm hoàn tất kiểm tra trước ngày thăm gặp. Gia đình vui lòng vào mục Lịch sử thăm gặp, mở phiếu liên quan và kiểm tra danh sách người đi cùng.

Thông tin cần bổ sung bao gồm họ tên, loại giấy tờ, số giấy tờ và mối quan hệ với người cai nghiện. Nếu có file xác minh, gia đình cần tải lên đúng định dạng được hệ thống hỗ trợ. Những thông tin này giúp bộ phận tiếp nhận đối chiếu nhanh khi người thân đến trung tâm.

Nếu không bổ sung trước thời hạn, phiếu thăm gặp có thể bị tạm dừng xử lý hoặc không được xác nhận trong ngày đăng ký.',
DATEADD(hour, -5, GETDATE()), 'CaNhan', 'DA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api')),

('TBLONG0036', 'NS_BS001', N'Thông báo nội bộ về ghi nhận nhật ký điều trị',
N'Bác sĩ phụ trách cần ghi nhận nhật ký điều trị sau các lần kiểm tra hoặc khi có thay đổi đáng chú ý về tình trạng sức khỏe của người cai nghiện. Nội dung nhật ký nên bao gồm tình trạng sức khỏe, triệu chứng, chỉ số cơ bản, thuốc sử dụng, chẩn đoán và hướng xử lý.

Nhật ký điều trị là nguồn dữ liệu quan trọng phục vụ đánh giá diễn biến sức khỏe, đối chiếu với phác đồ điều trị và làm căn cứ khi đề xuất chuyển giai đoạn. Thông tin cần được ghi rõ ràng, khách quan và tránh sử dụng các mô tả quá chung chung.

Nếu dữ liệu nhập sai, bác sĩ cần thực hiện chỉnh sửa theo quy trình và bảo đảm vẫn giữ được tính nhất quán của hồ sơ bệnh án.',
DATEADD(hour, -4, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),

('TBLONG0037', 'NS_STF01', N'Thông báo về thay đổi phòng thăm gặp trong ngày mai',
N'Do trung tâm thực hiện kiểm tra và sắp xếp lại khu vực tiếp khách, một số lượt thăm gặp trong ngày mai sẽ được chuyển sang phòng thăm gặp số 2. Thời gian thăm gặp không thay đổi so với lịch đã được phê duyệt trên hệ thống.

Người thân khi đến trung tâm sẽ được nhân viên hướng dẫn đến đúng phòng theo danh sách. Vui lòng không tự ý di chuyển giữa các khu vực hoặc vào phòng thăm gặp khi chưa có sự hướng dẫn của cán bộ phụ trách.

Trung tâm xin thông báo để gia đình chủ động thời gian và phối hợp thực hiện đúng quy định.',
DATEADD(hour, -3, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0038', 'NS_ADM01', N'Thông báo kiểm tra dữ liệu mẫu phục vụ demo giao diện',
N'Dữ liệu mẫu phục vụ demo giao diện đã được bổ sung cho các module thông báo, phiếu hỗ trợ, phiếu thăm gặp, phê duyệt tiếp nhận và phê duyệt phác đồ điều trị. Khi kiểm tra giao diện, người phát triển cần thử các trường hợp danh sách nhiều dòng, nội dung chi tiết dài, trạng thái chưa đọc và đã đọc.

Đối với module thông báo, cần kiểm tra khả năng hiển thị tiêu đề ngắn, nội dung dài nhiều đoạn, loại thông báo, trạng thái đọc và người nhận. Khi bấm vào một thông báo, giao diện cần mở được modal hoặc trang chi tiết để xem đầy đủ nội dung.

Nếu dữ liệu hiển thị bị cắt quá ngắn, cần kiểm tra lại CSS phần modal, chiều cao vùng nội dung và xử lý xuống dòng trong phần nội dung thông báo.',
DATEADD(hour, -2, GETDATE()), 'NoiBo', 'DA_DOC', NULL),

('TBLONG0039', 'NS_STF01', N'Thông báo mới về việc đọc kỹ nội dung trước khi xác nhận',
N'Một số thao tác trên hệ thống như hủy lịch thăm gặp, gửi yêu cầu hỗ trợ, cập nhật hồ sơ hoặc phê duyệt hồ sơ có thể ảnh hưởng trực tiếp đến dữ liệu quản lý. Người dùng cần đọc kỹ nội dung thông báo, hướng dẫn và xác nhận trước khi thực hiện các thao tác liên quan.

Đối với các chức năng có nút xác nhận hoặc từ chối, hệ thống có thể yêu cầu nhập ghi chú hoặc lý do xử lý. Nội dung ghi chú cần rõ ràng, lịch sự và đủ thông tin để người khác hiểu được căn cứ xử lý khi tra cứu lại.

Trung tâm khuyến khích người dùng kiểm tra lại thông tin trước khi lưu để giảm lỗi nhập liệu và tránh phải chỉnh sửa nhiều lần.',
DATEADD(hour, -1, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),

('TBLONG0040', 'NS_LD001', N'Thông báo cuối ngày về tình hình vận hành hệ thống',
N'Hệ thống trong ngày hôm nay ghi nhận các chức năng chính hoạt động ổn định, bao gồm đăng nhập, xem dashboard, xem thông báo, tra cứu danh sách hồ sơ, xem chi tiết thông báo và hiển thị dữ liệu thống kê. Một số dữ liệu mẫu đã được bổ sung để phục vụ kiểm thử giao diện và API.

Các bộ phận tiếp tục kiểm tra các màn hình theo vai trò, đặc biệt là vai trò lãnh đạo, quản trị hệ thống, bác sĩ và cán bộ quản lý. Trong quá trình kiểm thử, cần chú ý các trường hợp dữ liệu dài, bảng nhiều dòng, modal chi tiết, trạng thái hồ sơ và lọc dữ liệu.

Nếu phát hiện lỗi hoặc dữ liệu hiển thị chưa phù hợp, vui lòng ghi nhận lại màn hình, thao tác thực hiện và thời điểm phát sinh để thuận tiện xử lý.',
GETDATE(), 'NoiBo', 'CHUA_DOC', NULL);
GO

/* ============================================================
   KIEM TRA NHANH DU LIEU THONG BAO SAU KHI INSERT
   ============================================================ */
SELECT
    LoaiThongBao,
    TrangThai,
    COUNT(*) AS SoLuong
FROM ThongBao
GROUP BY LoaiThongBao, TrangThai
ORDER BY LoaiThongBao, TrangThai;
GO

SELECT TOP 10
    MaThongBao,
    TieuDe,
    LoaiThongBao,
    TrangThai,
    LEN(NoiDung) AS DoDaiNoiDung,
    NgayTao
FROM ThongBao
WHERE MaThongBao LIKE 'TBLONG%'
ORDER BY NgayTao DESC;
GO
