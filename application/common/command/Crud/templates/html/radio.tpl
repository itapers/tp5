
            <div class="radio">
            {foreach name="{%fieldList%}" item="vo"}
            <label for="{%fieldName%}-{$key}"><input id="{%fieldName%}-{$key}" name="{%fieldName%}" type="radio" value="{$key}" {in name="key" value="{%selectedValue%}"}checked{/in} /> {$vo}</label> 
            {/foreach}
            </div>
