
    public function {%methodName%}($value, $data)
    {
        $value = $value ? $value : $data['{%field%}'];
        $valueArr = explode(',', $value);
        $list = $this->{%listMethodName%}();
        return implode(',', array_intersect_key($list, array_flip($valueArr)));
    }