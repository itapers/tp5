<?php

namespace {%modelNamespace%};

use think\Model;

class {%modelName%} extends Model
{
    // 表名
    protected ${%modelTableType%} = '{%modelTableTypeName%}';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = {%modelAutoWriteTimestamp%};

    // 定义时间戳字段名
    protected $createTime = {%createTime%};
    protected $updateTime = {%updateTime%};

    // 追加属性
    protected $append = [
{%appendAttrList%}
    ];

{%modelInit%}

{%getEnumList%}

{%getAttrList%}

{%setAttrList%}
{%relationMethodList%}
}