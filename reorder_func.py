def reorder_slides(input_path, output_path, positions):
    """
    positions: list of (dst_index, src_index)
    将 input_path 的幻灯片按 positions 重新排列后保存到 output_path
    """
    ns = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}

    with zipfile.ZipFile(input_path, 'r') as z:
        pres_bytes = z.read('ppt/presentation.xml')

    root = ET_lxml.fromstring(pres_bytes)
    sld_id_lst = root.find('p:sldIdLst', ns)
    sld_ids = list(sld_id_lst.findall('p:sldId', ns))
    N = len(sld_ids)

    # positions → dst_to_src 映射
    dst_to_src = {dst: src for dst, src in positions}
    srcs_moved = set(src for _, src in positions)

    # 构建新顺序
    new_order = []
    orig_idx = 0

    for i in range(N):
        if i in dst_to_src:
            src = dst_to_src[i]
            new_order.append(sld_ids[src])
        else:
            while orig_idx in srcs_moved:
                orig_idx += 1
            if orig_idx < N:
                new_order.append(sld_ids[orig_idx])
            orig_idx += 1

    # 替换 sld_id_lst 的子元素
    sld_id_lst.clear()
    for elem in new_order:
        sld_id_lst.append(elem)

    new_bytes = ET_lxml.tostring(root, xml_declaration=True, encoding='UTF-8')

    tmp = output_path + '.tmp.zip'
    with zipfile.ZipFile(input_path, 'r') as zin:
        with zipfile.ZipFile(tmp, 'w') as zout:
            for item in zin.namelist():
                if item == 'ppt/presentation.xml':
                    zout.writestr(item, new_bytes)
                else:
                    zout.writestr(item, zin.read(item))
    os.replace(tmp, output_path)
    print(f"  ✅ 页码调整完成")
